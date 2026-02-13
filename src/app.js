const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { createContainer, asClass, asValue } = require('awilix');

const container = createContainer();
container.register({
  authService: asClass(require('./services/authService')).scoped(),
  userService: asClass(require('./services/userService')).scoped(),
  doctorService: asClass(require('./services/doctorService')).scoped(),
  bookingService: asClass(require('./services/bookingService')).scoped(),
  prescriptionService: asClass(require('./services/prescriptionService')).scoped(),
  analyticsService: asClass(require('./services/analyticsService')).scoped(),
  auditService: asClass(require('./services/auditService')).scoped(),
  jobQueue: asValue(require('./services/jobQueue')),
  logger: asValue(require('./utils/logger')),
  cryptoUtil: asValue(require('./utils/cryptoUtil'))
});

const app = express();
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const swaggerSpec = swaggerJSDoc({
  definition: { openapi: '3.0.0', info: { title: 'Amrutam API', version: '1.0.0' } },
  apis: ['./src/routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;