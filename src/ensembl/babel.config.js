module.exports = {
  presets: [
    '@babel/react',
    '@babel/typescript',
    [
      '@babel/env',
      {
        modules: false
      }
    ]
  ],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ],
  env: {
    test: {
      presets: [
        '@babel/react',
        '@babel/typescript',
        [
          '@babel/env',
          {
            modules: 'commonjs'
          }
        ]
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    }
  }
};
