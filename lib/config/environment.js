"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environments = exports.argvParser = void 0;
const culling_1 = require("./culling");
function argvParser() {
    const argv = process.argv.reduce((previous, current) => {
        if (current.indexOf('--') === 0) {
            previous.push({ name: current.replace(/^--/, ''), value: [] });
        }
        else if (previous.length) {
            const last = previous[previous.length - 1];
            last.value.push(current);
        }
        return previous;
    }, []);
    const ret = {};
    argv.forEach(v => {
        ret[v.name] = (v.value && v.value[v.value.length - 1]) || null;
    });
    return ret;
}
exports.argvParser = argvParser;
function loadEnv() {
    const argv = argvParser();
    const NODE_ENV = argv.mode === 'production' ?
        'production' :
        'development';
    return {
        PUBLIC_URL: '/',
        NODE_ENV,
        TIMESTAMP: Date.now(),
        PORT: argv.port || 3000,
    };
}
exports.environments = Object.assign({}, loadEnv(), culling_1.tryRead('environments'));
