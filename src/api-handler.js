
const serveMessage = (request, response, acceptHeader, statusCode, message, id) => {
  response.writeHead(statusCode, { 'Content-Type': acceptHeader });
  let str;
  if (acceptHeader === 'application/json') {
    const obj = {
      message,
    };
    if (id) obj.id = id;
    str = JSON.stringify(obj);
  } else if (acceptHeader === 'text/xml') {
    str = `
        <response>
            <message>${message}</message>
            ${id ? `<id>${id}</id>` : ''}
        </response>
        `;
  }

  response.write(str);
  response.end();
};

const serveSuccess = (request, response, acceptHeader) => {
  serveMessage(request, response, acceptHeader, 200, 'This is a successful response');
};

const serveBadRequest = (request, response, acceptHeader, queryParams) => {
  let statusCode; let id = null; let message;
  if (queryParams && queryParams.valid === 'true') {
    statusCode = 200;
    message = 'This request has the required parameters';
  } else {
    statusCode = 400;
    message = 'Missing valid query parameter set to true';
    id = 'badRequest';
  }
  serveMessage(request, response, acceptHeader, statusCode, message, id);
};

const serveUnauthorized = (request, response, acceptHeader, queryParams) => {
  let statusCode; let id = null; let message;
  if (queryParams && queryParams.loggedIn === 'yes') {
    statusCode = 200;
    message = 'This is a successful response';
  } else {
    statusCode = 401;
    message = 'Missing loggedIn query parameter set to yes';
    id = 'unauthorized';
  }
  serveMessage(request, response, acceptHeader, statusCode, message, id);
};

const serveForbidden = (request, response, acceptHeader) => {
  serveMessage(request, response, acceptHeader, 403, 'You do not have access to this content', 'forbidden');
};

const serveInternal = (request, response, acceptHeader) => {
  serveMessage(request, response, acceptHeader, 500, 'Internal Server Error. Something went wrong', 'internalError');
};

const serveNotImplemented = (request, response, acceptHeader) => {
  serveMessage(request, response, acceptHeader, 501,
    'A get request for this page has not been implemented yet. Check again later for updated content', 'notImplemented');
};

const serveNotFound = (request, response, acceptHeader) => {
  serveMessage(request, response, acceptHeader, 404, 'The page you are looking for was not found.', 'notFound');
};

module.exports = {
  serveSuccess,
  serveBadRequest,
  serveUnauthorized,
  serveForbidden,
  serveInternal,
  serveNotImplemented,
  serveNotFound,
};
