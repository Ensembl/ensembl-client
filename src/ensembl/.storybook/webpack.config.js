/*
  This config allows Storybook to use its default webpack config, with slight modifications
*/

const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = (baseConfig, env, defaultConfig) => {

  // a bit of a hack to remove svg handling from Storybook's default webpack config:
  // find the rule that matches svg files and replace its regex with Storybook's default,
  // but without svg
  const defaultSvgRule = defaultConfig.module.rules.find(rule => rule.test.test('.svg'));
  defaultSvgRule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

  defaultConfig.module.rules.push({
    test: /\.tsx?$/,
    loader: require.resolve('babel-loader'),
    include: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../stories'),
    ]
  });
  defaultConfig.module.rules.push({
    test: /\.json?$/,
    loader: require.resolve('json-loader'),
    include: [
      path.resolve(__dirname, '../src/data/json')
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
  defaultConfig.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack', 'file-loader'],
  });

  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  defaultConfig.resolve.alias = {
    src: path.join(__dirname, '../src'),
    static: path.join(__dirname, '../static')
  };

  return defaultConfig;
};
