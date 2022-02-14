// eslint-disable-next-line @typescript-eslint/no-var-requires
const apm = require('elastic-apm-node').start({
  // active: process.env.APM_URL !== undefined,
  serviceName: 'IGTG',
  environment: process.env.APP_ENV || 'develop',
  serverUrl: process.env.APM_URL,
});
