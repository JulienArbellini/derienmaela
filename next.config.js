const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  // Your existing module.exports
};

const SentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
