const { resolve } = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  srcPath: resolve(__dirname, './example'),
  publicDir: resolve(__dirname, './public'),
  entryPath: resolve(__dirname, './example/index.ts'),
  markdown: resolve(__dirname, './example/content'),
  moduleFederationPlugin: {
    name: 'test',
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
    PUBLIC_URL: '/',
  },
  proxy: createProxyMiddleware([
    '/api',
    '/vue',
  ], {
    target: 'http://127.0.0.1',
    ws: true,
    changeOrigin: true,
  }),
};
