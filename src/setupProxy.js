const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/chess',
    proxy.createProxyMiddleware({
      target: 'http://47.251.117.210:8090/chess',
      changeOrigin: true,
      pathRewrite: {
        '^/chess': ''
      }
    })
  );
};