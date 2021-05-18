"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_1 = require("webpack");
const path_1 = __importDefault(require("path"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const webpack_2 = require("webpack");
const InterpolateHtmlPlugin_1 = __importDefault(require("react-dev-utils/InterpolateHtmlPlugin"));
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
const synchronize_1 = require("../plugins/synchronize");
const path_2 = __importDefault(require("./path"));
const environment_1 = require("./environment");
const { ModuleFederationPlugin } = webpack_1.container;
const tryRead = (prop) => {
    try {
        return require(path_2.default.cullingConfig)[prop];
    }
    catch (err) {
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
    }
    catch (e) {
        return false;
    }
})();
exports.default = () => {
    const env = Object.assign({}, environment_1.environments);
    Object.assign(env, customEnv);
    const isProduction = env.NODE_ENV === 'production';
    isProduction ? synchronize_1.synchronize() : synchronize_1.watching();
    return {
        entry: path_2.default.entryPath,
        mode: env.NODE_ENV,
        devServer: {
            contentBase: path_2.default.outputPath,
            port: env.PORT,
            hot: true,
            historyApiFallback: true,
        },
        output: {
            path: path_2.default.outputPath,
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
                '@': path_2.default.srcPath,
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
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "entry",
                                    "corejs": 3
                                }
                            ],
                            [
                                "@babel/preset-typescript"
                            ],
                            [
                                "@babel/preset-react"
                            ]
                        ]
                    }
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
            new html_webpack_plugin_1.default({
                template: path_2.default.templatePath,
                inject: true,
            }),
            isProduction && new clean_webpack_plugin_1.CleanWebpackPlugin(),
            new webpack_2.DefinePlugin({
                'progress.env': Object.keys(env).reduce((previous, key) => {
                    previous[key] = JSON.stringify(env[key]);
                    return previous;
                }, {}),
            }),
            new InterpolateHtmlPlugin_1.default(html_webpack_plugin_1.default, Object.assign({}, env, { PUBLIC_URL: env.PUBLIC_URL.replace(/\/$/, '') })),
            new copy_webpack_plugin_1.default({
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
            new eslint_webpack_plugin_1.default({
                // Plugin options
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
                failOnError: isProduction,
                context: path_2.default.srcPath,
                cache: true,
                cacheLocation: path_1.default.resolve(process.cwd(), './node_modules/.cache/.eslintcache'),
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
