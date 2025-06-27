// ------------------------
// Imports
// ------------------------

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// ------------------------
// Utility Functions
// ------------------------

/**
 * 現在のファイルのディレクトリパスを取得
 * @returns {string} カレントディレクトリの絶対パス
 */
export const getCurrentDir = () => dirname(fileURLToPath(import.meta.url));

/**
 * JSONファイルから設定を読み込む
 * @param {string} filename - 読み込むJSONファイル名
 * @returns {Object} JSONオブジェクト
 * @throws ファイル読み込みやパース失敗時に例外を投げる
 */
export function loadJsonFile(filename) {
  const filePath = join(getCurrentDir(), filename);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load JSON file ${filename}:`, error.message);
    throw error;
  }
}

/**
 * MQTT可変長ヘッダーをエンコード
 * @param {number} length - エンコード対象の長さ
 * @returns {Buffer} エンコード結果バッファ
 */
export function encodeRemainingLength(length) {
  const bytes = [];
  do {
    let encodedByte = length % 128;
    length = Math.floor(length / 128);
    if (length > 0) encodedByte |= 0x80;
    bytes.push(encodedByte);
  } while (length > 0);
  return Buffer.from(bytes);
}

/**
 * バッファからUInt16BEを読み込み、次の読み取りオフセットを返す
 * @param {Buffer} buffer - 読み取り対象
 * @param {number} [offset=0] - 読み取り開始オフセット
 * @returns {{ value: number, offset: number }} 読み取り値と次オフセット
 */
export const readUInt16BE = (buffer, offset = 0) => ({
  value: buffer.readUInt16BE(offset),
  offset: offset + 2,
});

/**
 * バッファからMQTT文字列（長さ+文字列）を読み込み、次のオフセットを返す
 * @param {Buffer} buffer - 読み取り対象
 * @param {number} [offset=0] - 読み取り開始オフセット
 * @returns {{ value: string, offset: number }} 読み取り文字列と次オフセット
 */
export function readString(buffer, offset = 0) {
  const { value: length, offset: newOffset } = readUInt16BE(buffer, offset);
  const end = newOffset + length;
  return {
    value: buffer.toString('utf8', newOffset, end),
    offset: end,
  };
}

/**
 * ログ出力。将来的に winston 等に置き換えやすい形に。
 * @param {'debug'|'info'|'warn'|'error'} level - ログレベル
 * @param {string} message - ログメッセージ
 * @param {*} [data] - 補足情報（任意）
 */
export function log(level, message, data) {
  const timestamp = new Date().toISOString();
  const output = console[level] || console.log;
  const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  data ? output(formatted, data) : output(formatted);
}

/**
 * datas ディレクトリが存在しなければ作成し、そのパスを返す
 * @returns {string} datas ディレクトリの絶対パス
 */
export function ensureDataDir() {
  const dataDir = join(process.cwd(), 'datas');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    log('info', `Created datas directory: ${dataDir}`);
  }
  return dataDir;
}
