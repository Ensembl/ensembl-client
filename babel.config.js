const isTargetWeb = api =>
  api.caller((caller) => caller && caller.target === 'web');

module.exports = (api) => {
  const targets = isTargetWeb(api) ? {
    esmodules: true
  } : {
    node: 'current'
  };

  return {
    presets: [
      ['@babel/preset-react', {
        'runtime': 'automatic' // Starting from Babel 8, "automatic" will be the default runtime
      }],
      '@babel/typescript',
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          corejs: 3.26,
          modules: false,
          targets
        }
      ]
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/env',
            {
              useBuiltIns: 'usage',
              corejs: 3.26
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
