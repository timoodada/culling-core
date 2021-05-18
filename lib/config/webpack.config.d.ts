import HtmlWebpackPlugin from 'html-webpack-plugin';
import { container } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
declare const _default: () => {
    entry: string;
    mode: any;
    devServer: {
        contentBase: string;
        port: any;
        hot: boolean;
        historyApiFallback: boolean;
    };
    output: {
        path: string;
        publicPath: any;
        filename: string;
        chunkFilename: string;
    };
    resolve: {
        extensions: string[];
        alias: any;
    };
    module: {
        rules: ({
            test: RegExp;
            loader: string;
            options: {
                lazy: boolean;
                presets?: undefined;
            };
            exclude?: undefined;
            use?: undefined;
        } | {
            test: RegExp;
            loader: string;
            exclude: RegExp;
            options: {
                presets: (string | {
                    useBuiltIns: string;
                    corejs: number;
                })[][];
                lazy?: undefined;
            };
            use?: undefined;
        } | {
            test: RegExp;
            use: {
                loader: string;
                options: {
                    limit: number;
                };
            }[];
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
        } | {
            test: RegExp;
            use: {
                loader: string;
            }[];
            loader?: undefined;
            options?: undefined;
            exclude?: undefined;
        })[];
    };
    plugins: (HtmlWebpackPlugin | InterpolateHtmlPlugin | CopyPlugin | container.ModuleFederationPlugin | CleanWebpackPlugin | DefinePlugin | ESLintPlugin)[];
};
export default _default;
