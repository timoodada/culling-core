#!/usr/bin/env node

import webpack from 'webpack';
import makeConfig from './config/webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import express from 'express';
import { environments } from './config/environment';
import paths from './config/path';
import { resolve } from 'path';

const webpackConfig = makeConfig();

if (environments.NODE_ENV === 'production') {
  webpack(webpackConfig as any, (err, stats) => {
    if (err) {
      throw err;
    }
    process.stdout.write(stats!.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false,
    }) + '\n\n');
  });
} else {
  const compiler = webpack(webpackConfig as any);
  const app = express();
  app.use(
    webpackDevMiddleware(compiler,  {
      publicPath: environments.PUBLIC_URL,
    }),
  );
  app.use((req, res, next) => {
    const outputFileSystem = compiler.outputFileSystem;
    outputFileSystem.readFile(resolve(paths.outputPath, './index.html'), (err, content) => {
      if (err) {
        return next(err);
      }
      res.end(content);
    });
  });
  app.listen(webpackConfig.devServer.port, () => {
    // eslint-disable-next-line no-console
    console.log(`app listening on port ${webpackConfig.devServer.port}!`);
  });
}

