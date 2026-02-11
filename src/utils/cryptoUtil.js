const crypto = require('crypto');

// For production-grade encryption of sensitive fields (e.g. prescription details, MFA secrets)
// Using AES-256-GCM (authenticated encryption)

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12;  // GCM recommended IV length
const TAG_LENGTH = 16; // Authentication tag

// Derive key from environment variable (in production use KMS or secrets manager)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
  : crypto.randomBytes(KEY_LENGTH); // fallback for local dev – NEVER use in prod!

if (ENCRYPTION_KEY.length !== KEY_LENGTH) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
}

function encrypt(plainText) {
  if (!plainText) return null;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(encryptedData) {
  if (!encryptedData) return null;

  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':');
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted data format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt,
};