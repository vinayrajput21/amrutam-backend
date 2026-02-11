const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const logger = require('../utils/logger');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

const queue = new Queue('amrutam-jobs', { connection });

// Example worker (should be in separate file/process in production)
const worker = new Worker(
  'amrutam-jobs',
  async (job) => {
    switch (job.name) {
      case 'notifyPrescription':
        logger.info(`Sending prescription notification for ${job.data.prescriptionId}`);
        // TODO: integrate email/SMS/push notification service
        break;

      case 'sendBookingConfirmation':
        logger.info(`Sending booking confirmation for consultation ${job.data.consultationId}`);
        break;

      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = queue;