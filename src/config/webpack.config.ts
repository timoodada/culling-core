import HtmlWebpackPlugin from 'html-webpack-plugin';
import { container } from 'webpack';
import { resolve } from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import paths from './path';
import { environments } from './environment';
import { tryRead } from './culling';

const { ModuleFederationPlugin } = container;

const customAlias = tryRead('alias');
/**
 * @example
 * {
      name: 'app',
      filename: 'appEntry.js',
      remotes: {
        app2: 'app2@http://localhost/app2Entry.js',
      },
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        'axios': { requiredVersion: '^0.21.1' },
        'react': { requiredVersion: '^17.0.2' },
        'react-dom': { requiredVersion: '^17.0.2' },
        'react-router-dom': { requiredVersion: '^5.2.0' },
      },
    }
* */
const moduleFederationPlugin = tryRead('moduleFederationPlugin', {});

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
const config = () => {
  const isProduction = environments.NODE_ENV === 'production';
  return {
    entry: paths.entryPath,
    mode: environments.NODE_ENV,
    devServer: {
      contentBase: paths.outputPath,
      port: environments.PORT,
      hot: true,
      historyApiFallback: true,
    },
    output: {
      path: paths.outputPath,
      publicPath: environments.PUBLIC_URL,
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
        {
          test: /routes\.js/i,
          use: [{
            loader: require.resolve(
              resolve(__dirname, '../loaders/routes.js'),
            ),
          }],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin(moduleFederationPlugin),
      new HtmlWebpackPlugin({
        template: resolve(paths.publicDir, './index.html'),
        inject: true,
      }),
      isProduction && new CleanWebpackPlugin(),
      new DefinePlugin({
        'process.env': Object.keys(environments).reduce<any>((previous, key) => {
          previous[key] = JSON.stringify(environments[key]);
          return previous;
        }, {}),
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, Object.assign({}, environments)),
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDir,
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
        cacheLocation: resolve(
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

export default config;
