const client = require('prom-client');
const express = require('express');
const logger = require('./logger');

const register = new client.Registry();
client.collectDefaultMetrics({ register, timeout: 5000 });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Middleware to collect HTTP metrics
function httpMetricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer();
  const route = req.route ? req.route.path : req.originalUrl.split('?')[0];

  res.on('finish', () => {
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
    };

    end(labels);
    httpRequestsTotal.inc(labels);
  });

  next();
}

function startMetricsServer() {
  const app = express();
  app.get('/metrics', async (req, res) => {
    try {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (err) {
      logger.error('Error serving metrics', err);
      res.status(500).end('Internal Server Error');
    }
  });

  const port = process.env.METRICS_PORT || 9090;
  app.listen(port, () => {
    logger.info(`Prometheus metrics exposed on http://localhost:${port}/metrics`);
  });
}

module.exports = {
  register,
  httpRequestDuration,
  httpRequestsTotal,
  httpMetricsMiddleware,
  startMetricsServer,
};