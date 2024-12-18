class ResponseWrapper {
  static success(res, data = null, message = "success", status = "200") {
    return res.status(200).json({
      message: message,
      exception: null,
      detail: null,
      status: status,
      data: Array.isArray(data) ? data : data ? [data] : [],
    });
  }

  static error(
    res,
    message = "error",
    exception = null,
    detail = null,
    status = "500"
  ) {
    const statusCode = parseInt(status);
    return res.status(statusCode).json({
      message: message,
      exception: exception?.message || exception,
      detail: detail,
      status: status,
      data: [],
    });
  }

  static notFound(res, message = "Data tidak ditemukan") {
    return res.status(404).json({
      message: message,
      exception: null,
      detail: null,
      status: "404",
      data: [],
    });
  }

  static badRequest(res, message = "Bad Request") {
    return res.status(400).json({
      message: message,
      exception: null,
      detail: null,
      status: "400",
      data: [],
    });
  }

  static unauthorized(res, message = "Unauthorized") {
    return res.status(401).json({
      message: message,
      exception: null,
      detail: null,
      status: "401",
      data: [],
    });
  }
}

module.exports = ResponseWrapper;
