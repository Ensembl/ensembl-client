const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');
const HtmlPlugin = require('html-webpack-plugin');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const PrettierWebpackPlugin = require('prettier-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: path.join(__dirname, '../src/scripts/index.tsx'),
  mode: 'development',
  module: {
    rules: [{
        test: /.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssPresetEnv()
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|gif|png|jpe?g)$/,
        loader: 'file-loader',
        options: {
          name: `[path][name].[ext]`
        }
      }
    ]
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  output: {
    pathinfo: false,
    publicPath: '/'
  },
  plugins: [
    new ForkTsCheckerPlugin({
      tslint: true
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../assets/html/template.html')
    }),
    new PrettierWebpackPlugin(),
    new StylelintWebpackPlugin({
      context: 'src',
      files: '**/*.scss'
    })
  ],
  serve: {
    add: (app) => {
      app.use(convert(history()));
    },
    devMiddleware: {
      stats: {
        assets: false,
        chunks: false,
        colors: true,
        modules: false
      }
    },
    open: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
    alias: {
      assets: path.join(__dirname, '../assets')
    }
  },
  watchOptions: {
    ignored: /node_modules/
  }
};