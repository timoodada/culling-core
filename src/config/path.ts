import { resolve } from 'path';
import { tryRead } from './culling';

const entryPath = tryRead('entryPath', './src/index');
const publicDir = tryRead('publicDir', resolve(process.cwd(), './public'));
const srcPath = tryRead('srcPath', resolve(process.cwd(), './src'));

const paths = {
  srcPath,
  publicDir,
  outputPath: resolve(process.cwd(), './dist'),
  entryPath,
};

export default paths;
