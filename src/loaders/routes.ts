import { tryRead } from '../config/culling';
import glob from 'glob';
import { relative, resolve } from 'path';
import stringifyObject from 'stringify-object';

const markdownDir = tryRead('markdown', null);

export default async function loader(resource: string) {
  // @ts-ignore
  const resourcePath = this.resourcePath;
  // @ts-ignore
  const callback = this.async();
  if (!markdownDir || !/node_modules\/@culling\/core\/lib\/routes\.js$/i.test(resourcePath.replace(/\\/g, '/'))) {
    return callback(null, resource);
  }
  // @ts-ignore
  this.addContextDependency(markdownDir);
  const markdownFiles = glob.sync(resolve(markdownDir, './**/*.md'));
  const menu = markdownFiles.map(v => {
    const url = relative(markdownDir, v).replace(/(\.[^.]+$)/g, '').replace(/\\/g, '/');
    return { exact: true, path: `/${url}`, data: `require('${v}')` };
  });
  const stringify = stringifyObject(menu, {
    transform: (obj, prop, originalResult): string => {
      if (['data'].includes(prop as string)) {
        return (obj as any)[prop];
      }
      return originalResult;
    },
  });
  return callback(
    null,
    `export default ${stringify};`
  );
}
