declare module 'config' {
  const config: {
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
    [key: string]: string;
  };
  export = config;
}
