/**
 * LINE WORKS MQTT クライアント設定
 */

export const CONFIG = {
  /**
   * WebSocket接続設定
   */
  WS: {
    HOST: 'wss://jp1-web-noti.worksmobile.com/wmqtt',
    PROTOCOL: 'mqtt',
    ORIGIN: 'https://talk.worksmobile.com',
    USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    KEEP_ALIVE_INTERVAL_MS: 50 * 1000, // 50秒
    RECONNECT_DELAY_MS: 5000, // 5秒
    MAX_RECONNECT_ATTEMPTS: 5 // 最大再接続試行回数
  },

  /**
   * MQTT設定
   */
  MQTT: {
    PROTOCOL_NAME: 'MQTT',
    PROTOCOL_LEVEL: 4, // MQTT 3.1.1
    KEEP_ALIVE: 60, // 60秒
    CLEAN_SESSION: true
  },

  /**
   * ログ設定
   */
  LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
};

/**
 * デフォルト設定をエクスポート
 */
export default {
  CONFIG
};
