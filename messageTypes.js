/**
 * LINE WORKS メッセージタイプ定義
 * MQTTで受信するメッセージのタイプを定義
 * 
 * @fileoverview LINE WORKSのメッセージタイプとその日本語名を管理するモジュール
 * @version 1.0.0
 */

// --------------------- メッセージタイプ定義 ---------------------

/**
 * メッセージタイプの列挙型
 * @readonly
 * @enum {number}
 */
const MessageType = Object.freeze({
  // 基本メッセージタイプ
  UNKNOWN: 0,
  TEXT: 1,
  VOIP: 2,
  CONTACT: 3,
  LOCATION: 4,
  
  // ボット関連
  BOT: 5,
  BOT_LINK_IMAGE: 20,
  BOT_BUTTONS: 23,
  BOT_LIST: 24,
  BOT_LINK_RICH: 25,
  BOT_RICH: 27,
  BOT_FILE: 44,
  BOT_MENTION: 46,
  BOT_LINK_MENTION: 47,
  BOT_RICH_BUTTON_MENTION: 48,
  BOT_FLEX: 96,
  BOT_CAROUSEL: 97,
  BOT_IMAGE_CAROUSEL: 98,
  
  // メディア関連
  IMAGE: 11,
  AUDIO: 12,
  RECORD: 13,
  VIDEO: 14,
  FILE: 16,
  VOICE: 39,
  
  // スタンプ関連
  STICKER_OLD: 15,
  STICKER_V3: 18,
  STICKER: 18, // STICKER_V3のエイリアス
  
  // リッチメッセージ関連
  RICH: 8,
  NEW_RICH: 10,
  REPLY_RICH: 37,
  REPLY_STICKER: 38,
  
  // システム・公式関連
  OFFICIAL: 6,
  NOTI: 7,
  PROFILE: 26,
  TEMPLATE: 29,
  EXTERNAL_TEMPLATE: 49,
  
  // ノート・コメント関連
  TEAM_NOTE: 17,
  NOTE_COMMENT: 19,
  NOTE_WITH_MENTION: 28,
  GROUP_TEAM_NOTE: 106,
  
  // 通話・画面共有関連
  VOIP_GROUP_CALL_SCREEN_SHARE: 21,
  SCREEN_SHARE_INVITE: 107,
  SCREEN_SHARE_STOP: 107,
  SYS_SCREEN_SHARE: 110,
  VOIP2: 100,
  
  // 転送・その他
  MERGE_FORWARD: 22,
  LINE_GROUP_AUTO: 30,
  PTTSTT: 50,
  FOCUS_BOT_FLEX: 95,
  
  // システムメッセージ
  SYS_JOIN: 101,
  SYS_QUIT: 102,
  SYS_TITLE_CHANGE: 103,
  SYS_BIG_ROOM_CHAT: 116,
  SYS_SETTING: 120,
  
  // 管理・設定関連
  KICK_BOT: 104,
  CHAT_ROOM_PICTURE_CHANGE: 105,
  OUT_BLOCK: 108,
  SWITCH_GROUP_ROOM: 109,
  LINE_GROUP_KICKED_USER: 117,
  
  // 機能システム
  TRANSLATE_SYSTEM: 111,
  TRANSLATE_SYSTEM_V2: 118,
  FOLDER_SET_SYSTEM: 112,
  CALENDAR_USE: 113,
  DRIVE_USE: 114,
  HISTORY_MODE: 115,
  TASK_SYSTEM: 119
});

// --------------------- 日本語名定義 ---------------------

/**
 * メッセージタイプの日本語表示名
 * @readonly
 * @type {Object<number, string>}
 */
const MessageTypeNames = Object.freeze({
  // 基本メッセージタイプ
  [MessageType.UNKNOWN]: '不明なタイプ',
  [MessageType.TEXT]: 'テキストメッセージ',
  [MessageType.VOIP]: 'VOIP通話',
  [MessageType.CONTACT]: '連絡先',
  [MessageType.LOCATION]: '位置情報',
  
  // ボット関連
  [MessageType.BOT]: 'ボットメッセージ',
  [MessageType.BOT_LINK_IMAGE]: 'ボットリンク画像',
  [MessageType.BOT_BUTTONS]: 'ボットボタン',
  [MessageType.BOT_LIST]: 'ボットリスト',
  [MessageType.BOT_LINK_RICH]: 'ボットリンクリッチ',
  [MessageType.BOT_RICH]: 'ボットリッチ',
  [MessageType.BOT_FILE]: 'ボットファイル',
  [MessageType.BOT_MENTION]: 'ボットメンション',
  [MessageType.BOT_LINK_MENTION]: 'ボットリンクメンション',
  [MessageType.BOT_RICH_BUTTON_MENTION]: 'ボットリッチボタンメンション',
  [MessageType.BOT_FLEX]: 'ボットフレックス',
  [MessageType.BOT_CAROUSEL]: 'ボットカルーセル',
  [MessageType.BOT_IMAGE_CAROUSEL]: 'ボット画像カルーセル',
  
  // メディア関連
  [MessageType.IMAGE]: '画像',
  [MessageType.AUDIO]: '音声',
  [MessageType.RECORD]: '録音',
  [MessageType.VIDEO]: '動画',
  [MessageType.FILE]: 'ファイル',
  [MessageType.VOICE]: '音声メッセージ',
  
  // スタンプ関連
  [MessageType.STICKER_OLD]: 'スタンプ (旧)',
  [MessageType.STICKER_V3]: 'スタンプ',
  [MessageType.STICKER]: 'スタンプ',
  
  // リッチメッセージ関連
  [MessageType.RICH]: 'リッチメッセージ',
  [MessageType.NEW_RICH]: '新リッチメッセージ',
  [MessageType.REPLY_RICH]: 'リッチメッセージ返信',
  [MessageType.REPLY_STICKER]: 'スタンプ返信',
  
  // システム・公式関連
  [MessageType.OFFICIAL]: '公式アカウントメッセージ',
  [MessageType.NOTI]: '通知',
  [MessageType.PROFILE]: 'プロフィール',
  [MessageType.TEMPLATE]: 'テンプレート',
  [MessageType.EXTERNAL_TEMPLATE]: '外部テンプレート',
  
  // ノート・コメント関連
  [MessageType.TEAM_NOTE]: 'チームノート',
  [MessageType.NOTE_COMMENT]: 'ノートコメント',
  [MessageType.NOTE_WITH_MENTION]: 'メンション付きノート',
  [MessageType.GROUP_TEAM_NOTE]: 'グループチームノート',
  
  // 通話・画面共有関連
  [MessageType.VOIP_GROUP_CALL_SCREEN_SHARE]: 'グループ通話画面共有',
  [MessageType.SCREEN_SHARE_INVITE]: '画面共有招待',
  [MessageType.SCREEN_SHARE_STOP]: '画面共有終了',
  [MessageType.SYS_SCREEN_SHARE]: 'システム画面共有',
  [MessageType.VOIP2]: 'VOIP通話2',
  
  // 転送・その他
  [MessageType.MERGE_FORWARD]: '転送',
  [MessageType.LINE_GROUP_AUTO]: 'LINEグループ自動応答',
  [MessageType.PTTSTT]: 'プッシュトゥトーク音声認識',
  [MessageType.FOCUS_BOT_FLEX]: 'フォーカスボットフレックス',
  
  // システムメッセージ
  [MessageType.SYS_JOIN]: '参加',
  [MessageType.SYS_QUIT]: '退出',
  [MessageType.SYS_TITLE_CHANGE]: 'タイトル変更',
  [MessageType.SYS_BIG_ROOM_CHAT]: 'ビッグルームチャット',
  [MessageType.SYS_SETTING]: 'システム設定',
  
  // 管理・設定関連
  [MessageType.KICK_BOT]: 'ボットキック',
  [MessageType.CHAT_ROOM_PICTURE_CHANGE]: 'チャットルーム画像変更',
  [MessageType.OUT_BLOCK]: 'ブロック',
  [MessageType.SWITCH_GROUP_ROOM]: 'グループルーム切替',
  [MessageType.LINE_GROUP_KICKED_USER]: 'LINEグループからキックされたユーザー',
  
  // 機能システム
  [MessageType.TRANSLATE_SYSTEM]: '翻訳システム',
  [MessageType.TRANSLATE_SYSTEM_V2]: '翻訳システムV2',
  [MessageType.FOLDER_SET_SYSTEM]: 'フォルダ設定システム',
  [MessageType.CALENDAR_USE]: 'カレンダー使用',
  [MessageType.DRIVE_USE]: 'ドライブ使用',
  [MessageType.HISTORY_MODE]: '履歴モード',
  [MessageType.TASK_SYSTEM]: 'タスクシステム'
});

// --------------------- メッセージタイプ分類 ---------------------

/**
 * メッセージタイプの分類
 * @readonly
 * @type {Object<string, number[]>}
 */
const MessageTypeCategories = Object.freeze({
  BASIC: [
    MessageType.TEXT,
    MessageType.CONTACT,
    MessageType.LOCATION
  ],
  
  MEDIA: [
    MessageType.IMAGE,
    MessageType.AUDIO,
    MessageType.RECORD,
    MessageType.VIDEO,
    MessageType.FILE,
    MessageType.VOICE
  ],
  
  STICKER: [
    MessageType.STICKER_OLD,
    MessageType.STICKER_V3,
    MessageType.STICKER
  ],
  
  BOT: [
    MessageType.BOT,
    MessageType.BOT_LINK_IMAGE,
    MessageType.BOT_BUTTONS,
    MessageType.BOT_LIST,
    MessageType.BOT_LINK_RICH,
    MessageType.BOT_RICH,
    MessageType.BOT_FILE,
    MessageType.BOT_MENTION,
    MessageType.BOT_LINK_MENTION,
    MessageType.BOT_RICH_BUTTON_MENTION,
    MessageType.BOT_FLEX,
    MessageType.BOT_CAROUSEL,
    MessageType.BOT_IMAGE_CAROUSEL
  ],
  
  RICH: [
    MessageType.RICH,
    MessageType.NEW_RICH,
    MessageType.REPLY_RICH,
    MessageType.REPLY_STICKER
  ],
  
  SYSTEM: [
    MessageType.SYS_JOIN,
    MessageType.SYS_QUIT,
    MessageType.SYS_TITLE_CHANGE,
    MessageType.SYS_BIG_ROOM_CHAT,
    MessageType.SYS_SETTING,
    MessageType.SYS_SCREEN_SHARE
  ],
  
  COMMUNICATION: [
    MessageType.VOIP,
    MessageType.VOIP2,
    MessageType.VOIP_GROUP_CALL_SCREEN_SHARE,
    MessageType.SCREEN_SHARE_INVITE,
    MessageType.SCREEN_SHARE_STOP
  ]
});

// --------------------- ヘルパー関数 ---------------------

/**
 * メッセージタイプから日本語名を取得する
 * @param {number} type - メッセージタイプ番号
 * @returns {string} 日本語のメッセージタイプ名
 * @example
 * getMessageTypeName(1) // => 'テキストメッセージ'
 * getMessageTypeName(999) // => '不明なタイプ (999)'
 */
function getMessageTypeName(type) {
  if (typeof type !== 'number') {
    return `不明なタイプ (${type})`;
  }
  
  return MessageTypeNames[type] || `不明なタイプ (${type})`;
}

/**
 * メッセージタイプの詳細情報を取得する
 * @param {number} type - メッセージタイプ番号
 * @returns {Object} メッセージタイプの詳細情報
 */
function getMessageTypeInfo(type) {
  const name = getMessageTypeName(type);
  const category = getMessageTypeCategory(type);
  
  return {
    type,
    name,
    category,
    isKnown: type in MessageTypeNames,
    isSystem: MessageTypeCategories.SYSTEM.includes(type),
    isBot: MessageTypeCategories.BOT.includes(type),
    isMedia: MessageTypeCategories.MEDIA.includes(type)
  };
}

/**
 * メッセージタイプのカテゴリを取得する
 * @param {number} type - メッセージタイプ番号
 * @returns {string|null} カテゴリ名（見つからない場合はnull）
 */
function getMessageTypeCategory(type) {
  for (const [category, types] of Object.entries(MessageTypeCategories)) {
    if (types.includes(type)) {
      return category;
    }
  }
  return null;
}

/**
 * メッセージオブジェクトからメッセージタイプを取得する
 * @param {Object} msg - メッセージオブジェクト
 * @param {number} [msg.nType] - メッセージタイプ番号
 * @param {number} [msg.msgType] - 代替メッセージタイプ番号
 * @returns {string} メッセージタイプの日本語名
 * @example
 * getMessageType({ nType: 1 }) // => 'テキストメッセージ'
 * getMessageType({ msgType: 1 }) // => 'テキストメッセージ'
 * getMessageType({}) // => '不明なタイプ'
 */
function getMessageType(msg) {
  if (!msg || typeof msg !== 'object') {
    return getMessageTypeName(MessageType.UNKNOWN);
  }
  
  const type = msg.nType ?? msg.msgType;
  
  if (type === undefined) {
    return getMessageTypeName(MessageType.UNKNOWN);
  }
  
  return getMessageTypeName(type);
}

/**
 * カテゴリ内のメッセージタイプを取得する
 * @param {string} category - カテゴリ名
 * @returns {number[]} メッセージタイプの配列
 */
function getMessageTypesByCategory(category) {
  const upperCategory = category.toUpperCase();
  return MessageTypeCategories[upperCategory] || [];
}

/**
 * すべてのメッセージタイプを取得する
 * @returns {Array<{type: number, name: string, category: string}>} 全メッセージタイプ情報
 */
function getAllMessageTypes() {
  return Object.values(MessageType)
    .filter(type => typeof type === 'number')
    .map(type => ({
      type,
      name: getMessageTypeName(type),
      category: getMessageTypeCategory(type)
    }))
    .sort((a, b) => a.type - b.type);
}

export {
  getMessageType,
  getMessageTypeName,
  getMessageTypeInfo,
  getMessageTypeCategory,
  getMessageTypesByCategory,
  getAllMessageTypes,
  
  // 定数
  MessageType,
  MessageTypeNames,
  MessageTypeCategories
};