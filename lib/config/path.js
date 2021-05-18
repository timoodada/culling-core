"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = {
    srcPath: path_1.resolve(process.cwd(), './src'),
    publicDir: path_1.resolve(process.cwd(), './public'),
    templatePath: path_1.resolve(process.cwd(), './public/index.html'),
    outputPath: path_1.resolve(process.cwd(), './dist'),
    cullingConfig: path_1.resolve(process.cwd(), './culling.config.js'),
    entryPath: './src/index',
};
