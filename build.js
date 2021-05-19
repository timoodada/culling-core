const fs = require('fs-extra');
const glob = require('glob');
const { resolve } = require('path');
const childProgress = require('child_process');

fs.removeSync(resolve(__dirname, './lib'));
glob(resolve(__dirname, './src/**/{*.scss,*.css}'), (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    fs.copySync(file, file.replace(
      resolve(__dirname, './src').replace(/\\/g, '/'),
      resolve(__dirname, './lib').replace(/\\/g, '/'),
    ));
  });
  childProgress.exec('tsc');
});
