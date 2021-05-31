exports.codes = {
    "OK"            : 200, // The request has succeeded in GET, PUT
    "CREATED"       : 201, // The request has succeeded and a new resource has been created as a result. Response after POST. Cabecera Location con ubicación nueva
    "NOCONTENT"     : 204, // There is no content to send for this request, but the headers may be useful (DELETE)
    "BADREQUEST"    : 400, // The server could not understand the request due to invalid syntax.
    "UNAUTHORIZED"  : 401, // Unauthenticated
    "FORBIDDEN"     : 403, // Authenticated but unauthorized.
    "NOTFOUND"      : 404, // Resource not found in the server
    "CONFLICT"      : 409, // This response is sent when a request conflicts with the current state of the server.
    "SERVERERROR"   : 500  // Internal server error
}
