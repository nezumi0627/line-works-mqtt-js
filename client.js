// --------------------- Imports ---------------------
import fs from 'fs/promises';
import path from 'path';
import WebSocket from 'ws';
import winston from 'winston';

import { CONFIG } from './config.js';
import { COMMAND, CONNECT_FLAGS } from './mqttConstants.js';
import { loadJsonFile, encodeRemainingLength, ensureDataDir } from './utils.js';
import { getMessageType, MessageType } from './messageTypes.js';

// --------------------- 定数 ---------------------
const { WS: WS_CONFIG, MQTT: MQTT_CONFIG } = CONFIG;

const TYPE_NAME_MAP = Object.entries(MessageType).reduce((acc, [key, value]) => {
  if (typeof value === 'number') acc[value] = key;
  return acc;
}, {});

const CONN_ACK_CODES = {
  0: '接続が受け入れられました',
  1: 'プロトコルバージョンが不正です',
  2: 'クライアントIDが不正です',
  3: 'サーバーが利用できません',
  4: 'ユーザー名またはパスワードが不正です',
  5: '認証されていません'
};

const PACKET_TYPES = {
  CONNACK: 2,
  PUBLISH: 3,
  PINGRESP: COMMAND.PINGRESP >> 4
};

const QOS_LEVELS = {
  AT_MOST_ONCE: 0,
  AT_LEAST_ONCE: 1,
  EXACTLY_ONCE: 2
};

// --------------------- Logger Setup ---------------------
class Logger {
  constructor() {
    this.logger = this.createLogger();
  }

  createLogger() {
    const logDir = path.resolve('logs');
    
    return winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${stack || message}`;
        })
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(logDir, 'app.log'),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
          tailable: true
        })
      ]
    });
  }

  addConsoleTransport() {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] [${level}] ${stack || message}`;
          })
        )
      }));
    }
  }

  debug(msg, ...meta) { this.logger.debug(msg, ...meta); }
  info(msg, ...meta) { this.logger.info(msg, ...meta); }
  warn(msg, ...meta) { this.logger.warn(msg, ...meta); }
  error(msg, ...meta) { this.logger.error(msg, ...meta); }
}

// --------------------- ユーティリティ関数 ---------------------
const getTypeName = (typeCode) => TYPE_NAME_MAP[typeCode] || `UNKNOWN_${typeCode}`;

const getConnAckReturnCode = (code) => CONN_ACK_CODES[code] || `不明なエラーコード: ${code}`;

const loadCookie = async () => {
  try {
    const cookieData = await loadJsonFile('cookie.json');
    return cookieData.cookie || '';
  } catch (error) {
    throw new Error(`Failed to load cookie.json: ${error.message}`);
  }
};

const generateClientId = () => `mqtt-client-${Math.random().toString(16).substr(2, 8)}`;

// --------------------- MQTT パケット作成 ---------------------
class MQTTPacketBuilder {
  static createConnectPacket() {
    const clientId = generateClientId();
    const protocolNameBuf = Buffer.from(MQTT_CONFIG.PROTOCOL_NAME);
    const protocolNameLength = Buffer.alloc(2);
    protocolNameLength.writeUInt16BE(protocolNameBuf.length);

    const payload = [
      protocolNameLength,
      protocolNameBuf,
      Buffer.from([MQTT_CONFIG.PROTOCOL_LEVEL]),
      Buffer.from([MQTT_CONFIG.CLEAN_SESSION ? CONNECT_FLAGS.CLEAN_SESSION : 0]),
      Buffer.from([(MQTT_CONFIG.KEEP_ALIVE >> 8) & 0xff, MQTT_CONFIG.KEEP_ALIVE & 0xff]),
      Buffer.from([0x00, clientId.length]),
      Buffer.from(clientId)
    ];

    const remainingLength = payload.reduce((acc, buf) => acc + buf.length, 0);
    const packet = [
      Buffer.from([COMMAND.CONNECT]),
      encodeRemainingLength(remainingLength),
      ...payload
    ];

    return Buffer.concat(packet);
  }

  static createPingRequest() {
    return Buffer.from([COMMAND.PINGREQ, 0x00]);
  }

  static createPubAck(messageId) {
    return Buffer.from([0x40, 0x02, (messageId >> 8) & 0xff, messageId & 0xff]);
  }

  static createDisconnect() {
    return Buffer.from([0xE0, 0x00]);
  }
}

// --------------------- MQTT パケット解析 ---------------------
class MQTTPacketParser {
  static parsePublishPacket(data) {
    let offset = 1;
    let multiplier = 1;
    let remainingLength = 0;
    let encodedByte;

    // Remaining Length の解析
    do {
      encodedByte = data[offset++];
      remainingLength += (encodedByte & 0x7f) * multiplier;
      multiplier *= 0x80;
    } while ((encodedByte & 0x80) !== 0);

    // Topic Length の解析
    const topicLength = data.readUInt16BE(offset);
    offset += 2 + topicLength;

    // QoS とメッセージID の解析
    let messageId = null;
    const qos = (data[0] & 0x06) >> 1;
    if (qos > QOS_LEVELS.AT_MOST_ONCE) {
      messageId = data.readUInt16BE(offset);
      offset += 2;
    }

    const payload = data.slice(offset);
    return { qos, messageId, payload };
  }
}

// --------------------- メッセージ処理 ---------------------
class MessageProcessor {
  constructor(logger) {
    this.logger = logger;
  }

  async processMessage(payload) {
    const rawData = payload.toString('utf8');
    this.logger.debug('Received raw message: %s', rawData);

    if (!rawData.trim()) {
      this.logger.warn('Received empty payload');
      return null;
    }

    try {
      const message = JSON.parse(rawData);
      const msgType = getMessageType(message);
      const timestamp = message.createTime 
        ? new Date(message.createTime).toLocaleString() 
        : new Date().toLocaleString();

      this.logger.info(`Received message at ${timestamp} [type: ${msgType}, code: ${message.msgType || 'unknown'}]`);
      await this.logMessageType(message);
      return message;
    } catch (error) {
      this.logger.warn('Failed to parse JSON payload: %s', error.message);
      return null;
    }
  }

  async logMessageType(message) {
    try {
      const dataDir = ensureDataDir();
      const typeCode = message.msgType ?? message.nType;
      
      if (typeCode === undefined) {
        this.logger.warn('msgType または nType がありません');
        return;
      }

      const typeName = getTypeName(typeCode);
      const timestamp = new Date().toISOString();

      const typeDir = path.join(dataDir, 'message_types');
      await fs.mkdir(typeDir, { recursive: true });

      const typeFile = path.join(typeDir, `${typeCode}.json`);
      let typeData = {
        typeCode,
        typeName,
        firstSeen: timestamp,
        lastSeen: timestamp,
        count: 1,
        messages: []
      };

      try {
        const content = await fs.readFile(typeFile, 'utf8');
        if (content) {
          typeData = JSON.parse(content);
          typeData.lastSeen = timestamp;
          typeData.count = (typeData.count || 0) + 1;
        }
      } catch (error) {
        // ファイルが存在しない場合は新規作成
        const codesFile = path.join(dataDir, 'message_type_codes.txt');
        await fs.appendFile(codesFile, `${typeCode}\n`);
        this.logger.info(`New message type detected: ${typeCode} (${typeName})`);
      }

      const msgCopy = { ...message };
      delete msgCopy._recordedAt;
      msgCopy._recordedAt = timestamp;

      typeData.messages.unshift(msgCopy);
      typeData.messages = typeData.messages.slice(0, 10);

      await fs.writeFile(typeFile, JSON.stringify(typeData, null, 2));
    } catch (error) {
      this.logger.error('Error while logging message type: %s', error.message);
    }
  }
}

// --------------------- MQTT WebSocket クライアント ---------------------
class MQTTWebSocketClient {
  constructor() {
    this.logger = new Logger();
    this.logger.addConsoleTransport();
    this.messageProcessor = new MessageProcessor(this.logger);
    this.ws = null;
    this.keepAliveTimer = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const cookie = await loadCookie();
      
      this.ws = new WebSocket(WS_CONFIG.HOST, WS_CONFIG.PROTOCOL, {
        headers: {
          'User-Agent': WS_CONFIG.USER_AGENT,
          'Origin': WS_CONFIG.ORIGIN,
          'Cookie': cookie,
          'Sec-WebSocket-Protocol': WS_CONFIG.PROTOCOL
        }
      });

      this.setupEventHandlers();
    } catch (error) {
      this.logger.error('Failed to connect: %s', error.message);
      throw error;
    }
  }

  setupEventHandlers() {
    this.ws.on('open', () => this.handleOpen());
    this.ws.on('message', (data) => this.handleMessage(data));
    this.ws.on('error', (error) => this.handleError(error));
    this.ws.on('close', (code, reason) => this.handleClose(code, reason));
  }

  handleOpen() {
    this.logger.info('WebSocket connected');
    this.isConnected = true;
    this.ws.send(MQTTPacketBuilder.createConnectPacket());
    this.logger.debug('Sent MQTT CONNECT');
    this.startKeepAlive();
  }

  async handleMessage(data) {
    if (!(data instanceof Buffer)) return;

    const packetType = data[0] >> 4;

    switch (packetType) {
      case PACKET_TYPES.CONNACK:
        this.handleConnAck(data);
        break;
      
      case PACKET_TYPES.PUBLISH:
        await this.handlePublish(data);
        break;
      
      case PACKET_TYPES.PINGRESP:
        this.logger.debug('Received PINGRESP');
        break;
      
      default:
        this.logger.debug(`Received packet type: ${packetType}`);
    }
  }

  handleConnAck(data) {
    const returnCode = data[3];
    if (returnCode === 0) {
      this.logger.info('MQTT connection accepted');
    } else {
      this.logger.error(`MQTT connection refused: ${getConnAckReturnCode(returnCode)}`);
    }
  }

  async handlePublish(data) {
    const { qos, messageId, payload } = MQTTPacketParser.parsePublishPacket(data);
    
    await this.messageProcessor.processMessage(payload);

    if (qos === QOS_LEVELS.AT_LEAST_ONCE && messageId !== null) {
      this.ws.send(MQTTPacketBuilder.createPubAck(messageId));
    }
  }

  handleError(error) {
    this.logger.error('WebSocket error: %s', error.message);
    this.isConnected = false;
    this.stopKeepAlive();
  }

  handleClose(code, reason) {
    this.logger.info(`WebSocket closed: ${code} - ${reason}`);
    this.isConnected = false;
    this.stopKeepAlive();
  }

  startKeepAlive() {
    this.stopKeepAlive();

    this.keepAliveTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.logger.debug('Sending PINGREQ');
        this.ws.send(MQTTPacketBuilder.createPingRequest());
      }
    }, WS_CONFIG.KEEP_ALIVE_INTERVAL_MS);
  }

  stopKeepAlive() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  disconnect() {
    this.logger.info('Disconnecting...');
    this.stopKeepAlive();
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(MQTTPacketBuilder.createDisconnect());
      this.ws.close();
    }
    
    this.isConnected = false;
  }
}

// --------------------- アプリケーション起動 ---------------------
class Application {
  constructor() {
    this.client = new MQTTWebSocketClient();
    this.setupProcessHandlers();
  }

  async start() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Failed to start application:', error.message);
      process.exit(1);
    }
  }

  setupProcessHandlers() {
    const gracefulShutdown = () => {
      console.log('\nShutting down gracefully...');
      this.client.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }
}

// --------------------- エントリーポイント ---------------------
const app = new Application();
app.start().catch(console.error);

// --------------------- 補足 ---------------------
const getName = (type) => {
  return getMessageType({ nType: type });
};