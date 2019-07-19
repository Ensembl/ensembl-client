export default {
  // Version numbers
  app_version: '0.2.0',
  privacy_policy_version: '2.0.0',
  privacy_policy_cookie_name: 'ENSEMBL_PRIVACY_POLICY',
  privacy_policy_cookie_expiry: 'Sun, 01 Jan 2040 00:00:00 GMT',

  // Node environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Deployment environment
  environment: process.env.ENVIRONMENT,

  apiHost: process.env.API_HOST,

  // Keys for services
  googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY,

  // Genesearch endpoint
  genesearchAPIEndpoint: process.env.GENESEARCH_API_ENDPOINT
};
