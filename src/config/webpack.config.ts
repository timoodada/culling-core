import HtmlWebpackPlugin from 'html-webpack-plugin';
import { container } from 'webpack';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import { synchronize, watching } from '../plugins/synchronize';
import paths from './path';
import { environments } from './environment';

const { ModuleFederationPlugin } = container;
const tryRead = (prop: string) => {
  try {
    return require(paths.cullingConfig)[prop];
  } catch (err) {
    return {};
  }
};

const customEnv = tryRead('environments');
const customAlias = tryRead('alias');

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();
export default () => {
  const env: any = Object.assign({}, environments);
  Object.assign(env, customEnv);
  const isProduction = env.NODE_ENV === 'production';
  isProduction ? synchronize() : watching();
  return {
    entry: paths.entryPath,
    mode: env.NODE_ENV,
    devServer: {
      contentBase: paths.outputPath,
      port: env.PORT,
      hot: true,
      historyApiFallback: true,
    },
    output: {
      path: paths.outputPath,
      publicPath: env.PUBLIC_URL,
      filename: isProduction ?
        'static/js/[name].[contenthash:8].js' :
        'static/js/bundle.js',
      chunkFilename: isProduction ?
        'static/js/[name].[contenthash:8].chunk.js' :
        'static/js/[name].chunk.js',
    },
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.md', '.mdx', '.json'],
      alias: Object.assign({
        '@': paths.srcPath,
      }, customAlias),
    },
    module: {
      rules: [
        {
          test: /bootstrap\.(js|ts)x?$/,
          loader: 'bundle-loader',
          options: {
            lazy: true,
          },
        },
        {
          test: /\.(js|ts)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            'presets': [
              [
                '@babel/preset-env',
                {
                  'useBuiltIns': 'entry',
                  'corejs': 3,
                },
              ],
              [
                '@babel/preset-typescript',
              ],
              [
                '@babel/preset-react',
              ],
            ],
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg|bmp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.md$/,
          use: [{
            loader: 'babel-loader',
          }, {
            loader: require.resolve('@culling/remark-loader'),
          }],
        },
        {
          test: /\.(s[ac])|css$/i,
          use: [{
            // Creates `style` nodes from JS strings
            loader: 'style-loader',
          }, {
            // Translates CSS into CommonJS
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
          }, {
            // Compiles Sass to CSS
            loader: 'sass-loader',
          }],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'root-container',
        remotes: {},
        shared: {
          'axios': { singleton: true },
          'react': { singleton: true },
          'react-dom': { singleton: true },
          'react-router-dom': { singleton: true },
        },
      }),
      new HtmlWebpackPlugin({
        template: paths.templatePath,
        inject: true,
      }),
      isProduction && new CleanWebpackPlugin(),
      new DefinePlugin({
        'progress.env': Object.keys(env).reduce<any>((previous, key) => {
          previous[key] = JSON.stringify(env[key]);
          return previous;
        }, {}),
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, Object.assign({}, env, { PUBLIC_URL: env.PUBLIC_URL.replace(/\/$/, '') })),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            filter(file) {
              return !/index\.html$/.test(file);
            },
          },
        ],
        options: {
          concurrency: 100,
        },
      }),
      new ESLintPlugin({
        // Plugin options
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: isProduction,
        context: paths.srcPath,
        cache: true,
        cacheLocation: path.resolve(
          process.cwd(),
          './node_modules/.cache/.eslintcache',
        ),
        // ESLint class options
        cwd: process.cwd(),
        resolvePluginsRelativeTo: process.cwd(),
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
      }),
    ].filter(Boolean),
  };
};
