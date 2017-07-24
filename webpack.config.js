const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line
const IS_DEV = process.env.NODE_ENV !== 'production';
const path = require('path'); // eslint-disable-line
const baseDir = path.resolve(__dirname, './');
const srcPath = path.resolve(__dirname, './src');
const buildPath = path.resolve(__dirname, './build');


const entry = {
  index: `${srcPath}/index.js`,
  vendor: [
    'babel-polyfill',
    'react',
    'react-dom',
    'classnames',
  ]
};

const config = {
  context: baseDir,
  entry,
  output: {
    path: buildPath,
    filename: '[name].min.js',
    chunkFilename: 'chunks/[name]/[chunkhash].js',
    publicPath: '/build'
  },
  module: {
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
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: 100,
          // CSS图片目录
          name: '[path][name].[ext]'
        }
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              // https://github.com/webpack-contrib/css-loader
              options: {
                localIdentName: '[sx][hash:base64:8]',
                modules: true,
                camelCase: true,
                // minimize: true, // next组件里的css也需要跑一次压缩去重, 改为 OptimizeCssAssetsPlugin 统一处理
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
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDom: 'react-dom',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify( IS_DEV ? 'development' : 'production')
      }
    }),
    new ExtractTextPlugin({filename: '[name].min.css', allChunks: true}),
  ],
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
    alias: {
      components: srcPath + '/components',
    }
  }
};

if (IS_DEV) {
  config.plugins = config.plugins.concat(
    new webpack.HotModuleReplacementPlugin(),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin()
  );
  config.devtool = '#cheap-module-source-map';
  // https://webpack.js.org/configuration/dev-server/
  config.devServer = {
    contentBase: srcPath,
    hot: true,
    inline: true,
    host: '127.0.0.1',
    port: 8888
  };
} else {
  config.plugins.concat(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true, // eslint-disable-line
        warnings: false
      },
      mangle: {
        except: ['_', '$', 'exports', 'require']
      },
      output: {
        ascii_only: true // eslint-disable-line
      }
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'), // eslint-disable-line
      cssProcessorOptions: { discardComments: { removeAll: true }, zindex: false },
      canPrint: true
    })
  );
}

module.exports = config; // eslint-disable-line
