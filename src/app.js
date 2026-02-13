const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { createContainer, asClass } = require('awilix');

// DI Container
const container = createContainer();
container.register({
  // Register services for DI
  authService: asClass(require('./services/authService')).scoped(),
  // ... register other services
});

const app = express();
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

// Swagger setup
const swaggerSpec = swaggerJSDoc({
  definition: { openapi: '3.0.0', info: { title: 'Amrutam API', version: '1.0.0' } },
  apis: ['./src/routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

module.exports = app;