const { resolve } = require('path');

module.exports = {
  srcPath: resolve(__dirname, './example'),
  publicDir: resolve(__dirname, './public'),
  entryPath: resolve(__dirname, './example/index.ts'),
  markdown: resolve(__dirname, './example/content'),
  alias: {},
  moduleFederationPlugin: {
    name: 'system',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './example/shared',
    },
    shared: {
      'react': { requiredVersion: '^17.0.2' },
      'react-dom': { requiredVersion: '^17.0.2' },
      'react-router-dom': { requiredVersion: '^5.2.0' },
    },
  },
  environments: {
    PUBLIC_URL: '/app/',
  },
};
