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
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-react-css-modules-sass'
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
