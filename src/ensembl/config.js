export default {
  // environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  apiHost: process.env.API_HOST,

  // keys for services
  googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY
};
