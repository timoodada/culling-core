import paths from './path';

export const tryRead = (prop: string, defaultValue?: any) => {
  try {
    return require(paths.cullingConfig)[prop];
  } catch (err) {
    return defaultValue || {};
  }
};
