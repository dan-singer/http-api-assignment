const http = require('http');
const url = require('url');
const query = require('querystring');
const staticFileHandler = require('./static-file-handler.js');
const apiHandler = require('./api-handler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = {
  '/': (req, res) => staticFileHandler.serveStaticFile(req, res, '../client/client.html', 'text/html'),
  '/style.css': (req, res) => staticFileHandler.serveStaticFile(req, res, '../client/style.css', 'text/css'),
  '/success': apiHandler.serveSuccess,
  '/badRequest': apiHandler.serveBadRequest,
  '/unauthorized': apiHandler.serveUnauthorized,
  '/forbidden': apiHandler.serveForbidden,
  '/internal': apiHandler.serveInternal,
  '/notImplemented': apiHandler.serveNotImplemented,
  notFound: apiHandler.serveNotFound,
};

http.createServer((request, response) => {
  const parsedURL = url.parse(request.url);

  const queryParams = query.parse(parsedURL.query);
  const acceptHeaders = request.headers.accept.split(',');
  let mainAcceptHeader = acceptHeaders.length === 0 ? 'application/json' : acceptHeaders[0];

  if (mainAcceptHeader !== 'application/json' && mainAcceptHeader !== 'text/xml') mainAcceptHeader = 'application/json';

  if (parsedURL.pathname in router) {
    router[parsedURL.pathname](request, response, mainAcceptHeader, queryParams);
  } else {
    router.notFound(request, response, mainAcceptHeader, queryParams);
  }
})
  .listen(port);
