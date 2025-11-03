/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
  This config allows Storybook to use its default webpack config, with slight modifications
*/

import path from 'node:path';

export default (config: any) => {
  // a bit of a hack to remove svg handling from Storybook's default webpack config:
  // find the rule that matches svg files and replace its regex with Storybook's default,
  // but without svg
  const defaultSvgRule = config.module.rules.find((rule: any) =>
    rule.test.test('.svg')
  );
  defaultSvgRule.test =
    /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani)(\?.*)?$/;

  // remove the webpack rule for CSS files pre-defined in @storybook/react; we are going to use our own
  config.module.rules = config.module.rules.filter(
    (rule: any) => !rule.test?.test('file.css')
  );

  config.module.rules.push({
    test: /\.css$/,
    include: [
      path.resolve(import.meta.dirname, '../src'),
      path.resolve(import.meta.dirname, '../stories')
    ],
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          modules: {
            auto: true, // will match all files with a pattern /\.module\.\w+$/
            localIdentName: '[local]__[name]__[hash:base64:5]',
            namedExport: false, // since v 7.0 it is true by default, should we refactor our code to "import * as styles ..."?
            exportLocalsConvention: 'as-is' // consequence of using `namedExport: false` (the loader in this mode also camel-cases css class names). If namedExports were true, this field wouldn't have been needed
          }
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [['postcss-preset-env']]
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
        type: 'asset/resource'
      },
      {
        use: ['@svgr/webpack']
      }
    ]
  });

  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    config: path.join(import.meta.dirname, '../config.ts'),
    src: path.join(import.meta.dirname, '../src'),
    tests: path.join(import.meta.dirname, '../tests'),
    static: path.join(import.meta.dirname, '../static')
  };

  return config;
};
