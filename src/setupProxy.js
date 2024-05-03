const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // Specify the path you want to proxy
    createProxyMiddleware({
      target: 'https://api.synchtravel.com',
      changeOrigin: true,
      
    })
  );
};


// const {proxy} =  require("https-proxy-middleware");
// module.exports = (app) => {
//   app.use(
//     "/api/",
//     proxy({
//       target: "https://api.synchtravel.com",
//       changeorigin: true,
//       pathrewrite: {
//         "^/api/": "/"
//       },
//     })
//   );
// };