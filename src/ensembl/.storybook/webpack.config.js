const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.tsx?$/,
    loader: require.resolve('babel-loader'),
    include: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../stories'),
    ]
  });
  defaultConfig.module.rules.push({
    test: /.scss$/,
    include: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../stories'),
    ],
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: true,
          localIdentName: '[local]__[name]__[hash:base64:5]'
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          plugins: () => [postcssPresetEnv()]
        }
      },
      'sass-loader'
    ]
  });
  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  defaultConfig.resolve.alias = {
    src: path.join(__dirname, '../src'),
    static: path.join(__dirname, '../static')
  };

  return defaultConfig;
};
