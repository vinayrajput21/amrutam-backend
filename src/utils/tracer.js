const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const logger = require('./logger');

function setupTracing() {
  if (process.env.NODE_ENV === 'test') return;

  const exporter = new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
      'http://localhost:4318/v1/traces',
  });

  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: resourceFromAttributes({
      [SemanticResourceAttributes.SERVICE_NAME]:
        'amrutam-telemedicine-backend',
    }),
  });

  sdk.start();

  logger.info('OpenTelemetry tracing initialized');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    try {
      await sdk.shutdown();
      logger.info('Tracing shut down successfully');
    } catch (err) {
      logger.error('Error shutting down tracing', err);
    } finally {
      process.exit(0);
    }
  });
}

module.exports = { setupTracing };
