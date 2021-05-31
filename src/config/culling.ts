import { resolve } from 'path';

const cullingConfig = resolve(process.cwd(), './culling.config.js');

export const tryRead = (prop: string, defaultValue?: any) => {
  try {
    const value = require(cullingConfig)[prop];
    return typeof value === 'undefined' ? defaultValue : value;
  } catch (err) {
    return defaultValue;
  }
};
