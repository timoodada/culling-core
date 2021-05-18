#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const webpack_config_1 = __importDefault(require("./config/webpack.config"));
const webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
const express_1 = __importDefault(require("express"));
const environment_1 = require("./config/environment");
const path_1 = __importDefault(require("./config/path"));
const path_2 = require("path");
const app = express_1.default();
const webpackConfig = webpack_config_1.default();
const compiler = webpack_1.default(webpackConfig);
app.use(webpack_dev_middleware_1.default(compiler, {
    publicPath: environment_1.environments.PUBLIC_URL,
}));
app.use((req, res, next) => {
    const outputFileSystem = compiler.outputFileSystem;
    outputFileSystem.readFile(path_2.resolve(path_1.default.outputPath, './index.html'), (err, content) => {
        if (err) {
            return next(err);
        }
        res.end(content);
    });
});
app.listen(webpackConfig.devServer.port, () => {
    console.log(`app listening on port ${webpackConfig.devServer.port}!`);
});
