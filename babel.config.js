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
      '@babel/react',
      '@babel/typescript',
      [
        '@babel/env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
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
              corejs: 3
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
