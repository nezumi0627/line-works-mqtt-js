/**
 * MQTT プロトコル定数
 */

// コマンドタイプ
const COMMAND = {
  CONNECT: 0x10,
  CONNACK: 0x20,
  PUBLISH: 0x30,
  PUBACK: 0x40,
  PUBREC: 0x50,
  PUBREL: 0x60,
  PUBCOMP: 0x70,
  SUBSCRIBE: 0x80,
  SUBACK: 0x90,
  UNSUBSCRIBE: 0xA0,
  UNSUBACK: 0xB0,
  PINGREQ: 0xC0,
  PINGRESP: 0xD0,
  DISCONNECT: 0xE0
};

// QoSレベル
const QOS = {
  AT_MOST_ONCE: 0,
  AT_LEAST_ONCE: 1,
  EXACTLY_ONCE: 2
};

// コネクトリターンコード
const CONNECT_RETURN_CODE = {
  0: '接続が受け入れられました',
  1: 'プロトコルバージョンが不正です',
  2: 'クライアントIDが不正です',
  3: 'サーバーが利用できません',
  4: 'ユーザー名またはパスワードが不正です',
  5: '認証されていません'
};

// パケットフラグ
const PACKET_FLAGS = {
  DUP: 0x08,      // 重複フラグ
  RETAIN: 0x01,   // 保持フラグ
  QOS_SHIFT: 1,   // QoSビットシフト値
  QOS_MASK: 0x06  // QoSビットマスク
};

// コネクトフラグ
const CONNECT_FLAGS = {
  CLEAN_SESSION: 0x02,
  WILL_FLAG: 0x04,
  WILL_QOS_0: 0x00,
  WILL_QOS_1: 0x08,
  WILL_QOS_2: 0x10,
  WILL_RETAIN: 0x20,
  PASSWORD: 0x40,
  USERNAME: 0x80
};

// デフォルトのトピック
const TOPICS = {
  MESSAGE: '/message',
  NOTIFICATION: '/notification',
  PRESENCE: '/presence'
};

// エクスポート
export {
  COMMAND,
  QOS,
  CONNECT_RETURN_CODE,
  PACKET_FLAGS,
  CONNECT_FLAGS,
  TOPICS
};