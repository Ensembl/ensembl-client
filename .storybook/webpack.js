/*
  This config allows Storybook to use its default webpack config, with slight modifications
*/

import path from 'node:path';

export default (config) => {

  // a bit of a hack to remove svg handling from Storybook's default webpack config:
  // find the rule that matches svg files and replace its regex with Storybook's default,
  // but without svg
  const defaultSvgRule = config.module.rules.find(rule => rule.test.test('.svg'));
  defaultSvgRule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

  // remove the webpack rule for CSS files pre-defined in @storybook/react; we are going to use our own
  config.module.rules = config.module.rules.filter(rule => !rule.test?.test('file.css'));

  config.module.rules.push({
    test: /\.css$/,
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
          modules: {
            auto: true, // will match all files with a pattern /\.module\.\w+$/
            localIdentName: '[local]__[name]__[hash:base64:5]'
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              ['postcss-preset-env']
            ]
          }
        }
      }
    ]
  });
  config.module.rules.push({
    test: /\.svg$/,
    oneOf: [
      {
        resourceQuery: /url/, // will match all imports that end in `.svg?url`
        type: 'asset/resource',
      },
      {
        use: ['@svgr/webpack']
      }
    ]
  });

  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    config: path.join(__dirname, '../config.ts'),
    src: path.join(__dirname, '../src'),
    tests: path.join(__dirname, '../tests'),
    static: path.join(__dirname, '../static')
  };

  return config;
};
