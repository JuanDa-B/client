const { createProxyMiddleware } = require('http-proxy-middleware');

// En desarrollo, redirigir las llamadas API al servidor local
// En producción, esto no se usa porque las llamadas se hacen directamente a la URL completa
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
}; 