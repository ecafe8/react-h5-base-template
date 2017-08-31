const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line
const IS_DEV = process.env.NODE_ENV !== 'production';
const path = require('path'); // eslint-disable-line
const srcPath = path.resolve('./src');

module.exports = (config) => {
  const { module, resolve } = config;

  const updatedConfig =  {
    ...config,
    module: {
      ...module,
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }, {
          test: /\.css/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
          }),
        },
        {
          test: /\.mp3$/,
          exclude: /node_modules/,
          loader: 'file-loader',
          query: {
            // CSS图片目录
            name: IS_DEV ? '[path][name].[ext]' : 'assets/mp3/[hash].[ext]',
          }
        },
        {
          test: /\.mp4/,
          exclude: /node_modules/,
          loader: 'file-loader',
          query: {
            // CSS图片目录
            name: IS_DEV ? '[path][name].[ext]' : 'assets/video/[hash].[ext]',
          }
        }, {
          test: /\.(png|jpg|gif)$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            // CSS图片目录
            name: IS_DEV ? '[path][name].[ext]' : 'assets/[name].[ext]',
          }
        }, {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  localIdentName: '[sx][hash:base64:8]',
                  modules: true,
                  camelCase: true,
                  sourceMap: IS_DEV
                }
              }, {
                loader: 'px2rem-loader',
                options: {
                  remUnit: 75,
                  remPrecision: 8,
                }
              }, {
                loader: 'less-loader',
                options: {
                  sourceMap: IS_DEV
                }
              }],
          }),
        },
      ]
    },
    resolve: {
      ...resolve,
      alias: {
        components: srcPath + '/components',
      }
    }
  };
  updatedConfig.plugins.push(
    new ExtractTextPlugin({filename: '[name].min.css', allChunks: true})
  );

  return updatedConfig;
};
