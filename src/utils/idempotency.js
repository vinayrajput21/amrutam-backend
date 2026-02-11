const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

/**
 * Simple in-memory idempotency store for demo purposes.
 * In production → use Redis with TTL or database table with unique constraint + expiration
 */
const idempotencyStore = new Map(); // key → { response, timestamp }

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, value] of idempotencyStore.entries()) {
    if (now - value.timestamp > IDEMPOTENCY_TTL_MS) {
      idempotencyStore.delete(key);
    }
  }
}

setInterval(cleanupOldEntries, 60 * 60 * 1000); // hourly cleanup

/**
 * Check or store idempotent response
 * @param {string} key - idempotency key from header
 * @param {Function} operation - async function that performs the real action
 * @returns {Promise<any>} result of operation or cached response
 */
async function withIdempotency(key, operation) {
  if (!key) {
    logger.warn('No idempotency key provided – proceeding without protection');
    return operation();
  }

  const normalizedKey = key.trim().toLowerCase();

  if (idempotencyStore.has(normalizedKey)) {
    const cached = idempotencyStore.get(normalizedKey);
    logger.info(`Idempotent hit for key: ${normalizedKey}`);
    return cached.response;
  }

  try {
    const result = await operation();

    idempotencyStore.set(normalizedKey, {
      response: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (err) {
    // Do NOT cache errors – let client retry on conflict/failure
    throw err;
  }
}

module.exports = {
  withIdempotency,
  // For tests or manual cleanup
  __test__clearStore: () => idempotencyStore.clear(),
};