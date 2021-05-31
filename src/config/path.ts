import { resolve } from 'path';
import { tryRead } from './culling';

const entryPath = tryRead('entryPath', './src/index') as string;
const publicDir = tryRead('publicDir', resolve(process.cwd(), './public')) as string;
const srcPath = tryRead('srcPath', resolve(process.cwd(), './src')) as string;

const paths = {
  srcPath,
  publicDir,
  outputPath: resolve(process.cwd(), './dist'),
  entryPath,
};

export default paths;
