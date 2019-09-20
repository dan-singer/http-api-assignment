const fs = require('fs');
const path = require('path');


const serveStaticFile = (request, response, relativePath, contentType) => {
  const file = path.resolve(__dirname, relativePath);
  response.writeHead(200, { 'Content-Type': contentType });
  const stream = fs.createReadStream(file);
  stream.on('open', () => {
    stream.pipe(response);
  });
};

module.exports = { serveStaticFile };
