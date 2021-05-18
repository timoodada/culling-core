import { resolve } from 'path';

export default {
  srcPath: resolve(process.cwd(), './src'),
  publicDir: resolve(process.cwd(), './public'),
  templatePath: resolve(process.cwd(), './public/index.html'),
  outputPath: resolve(process.cwd(), './dist'),
  cullingConfig: resolve(process.cwd(), './culling.config.js'),
  entryPath: './src/index',
};
