export default {
  // Version numbers
  app_version: '0.4.0',

  // Node environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Deployment environment
  environment: process.env.ENVIRONMENT,

  apiHost: process.env.API_HOST,

  // Keys for services
  googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY,

  // Genesearch endpoint
  genesearchAPIEndpoint: process.env.GENESEARCH_API_ENDPOINT,

  // Prismic API endpoint
  prismicApiEndpoint: process.env.PRISMIC_API_ENDPOINT
};
