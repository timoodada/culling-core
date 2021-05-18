import glob from 'glob';
import fs from 'fs-extra';
import path from 'path';
import stringifyObject from 'stringify-object';
import chokidar from 'chokidar';

const srcPath = path.resolve(process.cwd(), './src');

export const synchronize = () => {
  const markdownFiles = glob.sync(path.resolve(srcPath, './content/**/*.md'));
  const menu = markdownFiles.map(v => {
    const relative = `@${path.relative(srcPath, v)}`.replace(/\\/g, '/');
    const url = relative.replace(/(^@content)|(\.[^.]+$)/g, '');
    return { exact: true, path: url, data: `require('${relative}')` };
  });
  const stringify = stringifyObject(menu, {
    transform: (obj, prop, originalResult): string => {
      if (['data'].includes(prop as string)) {
        return (obj as any)[prop];
      }
      return originalResult;
    },
  });
  fs.outputFileSync(path.resolve(__dirname, '../routes.js'), `export default ${stringify};`);
};

export function watching() {
  synchronize();
  chokidar.watch(path.resolve(srcPath, './content')).on('add', () => {
    synchronize();
  });
}
