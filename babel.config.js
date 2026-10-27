module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      "@babel/preset-typescript",
    ],
    overrides: [
      {
        test: /\.tsx$/,
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }
    ],
    env: {
      production: {
        plugins: [
          ['react-remove-properties', { 'properties': [ 'data-test-id' ] }]
        ]
      }
    }
  };

} 
