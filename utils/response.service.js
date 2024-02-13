const defaultStatus = 400;

class ResponseService {
  static json(res, statusOrError, message, data, meta, code) {
    const error = statusOrError instanceof Error ? statusOrError : null;

    let response = {};
    let status = statusOrError;

    if (message) response.message = message;

    if (error) {
      const errorObj = statusOrError;
      response.message = message || errorObj.message;
      status = defaultStatus;
    }
    if (data) {
      response.data = data;
    }

    if (meta) {
      response.meta = meta;
    }

    if (code) {
      response.code = code;
    }

    const statusCode = Number(status);

    res.status(statusCode).json(response);
  }
}

export { ResponseService };
