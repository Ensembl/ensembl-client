const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const { getPaths } = require('../paths');

module.exports = (env) => {
  const isDev = env.dev;
  const paths = getPaths();
  return {
    // the starting point of webpack bundling
    entry: {
      index: path.join(paths.rootPath, 'src/index.tsx')
    },

    module: {
      rules: [
        {
          test: /\.worker\.ts$/,
          use: [
            { loader: "worker-loader" },
            { loader: 'babel-loader' }
          ],
        },
        {
          test: /.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },

        // the loaders for styling
        // a scss file will first be loaded via sass loader and transpiled
        // afterwards it will be processed by postcss loader to make the css cross-browser compatible
        // add the processed css into the html document during runtime for dev
        // and extract the css for prod and minify it as external stylesheets
        {
          test: /.scss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  localIdentName: '[local]__[name]__[hash:base64:5]'
                },
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
            },
            'sass-loader'
          ]
        },

        // use file-loader on svg's (to be able to require them as a path to the image),
        // but also use @svgr/webpack to be able to require svg's directly as React components
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'file-loader'],
        }
      ]
    },

    // prevent webpack from searching fs (node API) to load the web assembly files
    // node: {
    //   fs: 'empty'
    // },

    // this is the config to define how the output files needs to be
    output: {
      // dev will take the default file names as no physical files are emitted
      // prod will have emitted files and will include the content hash, which will change every time the contents of the js file changes.
      filename: isDev ? undefined : '[name].[contenthash].js',

      path: paths.buildStaticPath,

      // stop webpack from adding additional comments/info to generated bundles as it is a performance hit (slows down build times)
      pathinfo: false,

      // prepend the public path as the root path to all the files that are inserted into the index file
      publicPath: isDev ? '/' : '/static/'
    },

    // the plugins that extends the webpack configuration
    plugins: [
      // checks typescript types
      new ForkTsCheckerPlugin(),

      // generates the index file using the provided html template
      new HtmlPlugin({
        // in prod, path for saving static assets is dist/static/, and index.html has to be saved top-level in the dist folder
        filename: isDev ? 'index.html' : '../index.html',
        template: paths.htmlTemplatePath,
        publicPath: isDev ? '/' : '/static'
      })
      
    ],

    // configuration that allows us to not to use file extensions and shorten import paths (using aliases)
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.scss'],
      alias: {
        config: path.join(paths.rootPath, 'config.ts'),
        src: path.join(paths.rootPath, 'src'),
        tests: path.join(paths.rootPath, 'tests'),
        static: path.join(paths.rootPath, 'static'),
        fs: false,
        path: false
      }
    }
  }
};
