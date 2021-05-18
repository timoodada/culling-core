"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.sync = void 0;
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const stringify_object_1 = __importDefault(require("stringify-object"));
const chokidar_1 = __importDefault(require("chokidar"));
const srcPath = path_1.default.resolve(process.cwd(), './src');
const sync = () => {
    const markdownFiles = glob_1.default.sync(path_1.default.resolve(srcPath, './content/**/*.md'));
    const menu = markdownFiles.map(v => {
        const relative = `@${path_1.default.relative(srcPath, v)}`.replace(/\\/g, '/');
        const url = relative.replace(/(^@content)|(\.[^.]+$)/g, '');
        return { exact: true, path: url, data: `require('${relative}')` };
    });
    const stringify = stringify_object_1.default(menu, {
        transform: (obj, prop, originalResult) => {
            if (['data'].includes(prop)) {
                return obj[prop];
            }
            return originalResult;
        },
    });
    fs_extra_1.default.outputFileSync(path_1.default.resolve(__dirname, '../routes.js'), `export default ${stringify};`);
};
exports.sync = sync;
function watch() {
    exports.sync();
    chokidar_1.default.watch(path_1.default.resolve(srcPath, './content')).on('add', () => {
        exports.sync();
    });
}
exports.watch = watch;
