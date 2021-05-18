"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynchronizePlugin = exports.watching = exports.synchronize = void 0;
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const stringify_object_1 = __importDefault(require("stringify-object"));
const chokidar_1 = __importDefault(require("chokidar"));
const culling_1 = require("../config/culling");
const environment_1 = require("../config/environment");
const markdownDir = culling_1.tryRead('markdown', null);
const routes = path_1.resolve(__dirname, '../routes.js');
const synchronize = () => {
    if (markdownDir) {
        const markdownFiles = glob_1.default.sync(path_1.resolve(markdownDir, './**/*.md'));
        const menu = markdownFiles.map(v => {
            const url = path_1.relative(markdownDir, v).replace(/(\.[^.]+$)/g, '').replace(/\\/g, '/');
            return { exact: true, path: `/${url}`, data: `require('${v}')` };
        });
        const stringify = stringify_object_1.default(menu, {
            transform: (obj, prop, originalResult) => {
                if (['data'].includes(prop)) {
                    return obj[prop];
                }
                return originalResult;
            },
        });
        fs_extra_1.default.outputFileSync(routes, `export default ${stringify};`);
    }
    return Promise.resolve();
};
exports.synchronize = synchronize;
function watching(callback = () => { }) {
    if (markdownDir) {
        chokidar_1.default.watch(markdownDir).on('add', () => {
            exports.synchronize().then(callback);
        });
    }
}
exports.watching = watching;
class SynchronizePlugin {
    apply(compiler) {
        compiler.hooks.watchRun.tap('synchronize-menu', (compiler) => {
        });
        const isProduction = environment_1.environments.NODE_ENV === 'production';
        isProduction ? exports.synchronize().then() : watching();
    }
}
exports.SynchronizePlugin = SynchronizePlugin;
