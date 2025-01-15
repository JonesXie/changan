import { defineConfig } from '@umijs/max';

export default defineConfig({
  mpa: {},
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '',
  },
  routes: [],
  proxy: {
    '/api/': {
      target: 'http://192.168.2.45:8080',
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
  npmClient: 'pnpm',
});
