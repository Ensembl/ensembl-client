module.exports = {
  presets: [
    '@babel/react',
    '@babel/typescript',
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false
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
