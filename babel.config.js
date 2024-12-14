const isTargetWeb = api =>
  api.caller((caller) => caller && caller.target === 'web');

module.exports = (api) => {
  const babelPresetEnvOptions = {
    // debug: true, // <-- Enable if you want to debug what babel is doing
    useBuiltIns: 'usage',
    corejs: 3.39,
    modules: false
  };
  if (!isTargetWeb(api)) {
    // change babel compile target for node
    babelPresetEnvOptions.targets = { node: 'current' };
  }

  return {
    presets: [
      ['@babel/preset-react', {
        'runtime': 'automatic' // Starting from Babel 8, "automatic" will be the default runtime
      }],
      '@babel/typescript',
      [
        '@babel/preset-env',
        babelPresetEnvOptions
      ]
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: 3.39
            }
          ]
        ]
      },
      production: {
        plugins: [
          ['react-remove-properties', { 'properties': [ 'data-test-id' ] }]
        ]
      }
    }
  };

} 
