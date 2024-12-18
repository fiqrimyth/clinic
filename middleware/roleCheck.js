const ResponseWrapper = require("../utils/responseWrapper");

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return ResponseWrapper.unauthorized(
      res,
      "Akses ditolak. Hanya admin yang diizinkan."
    );
  }
};

exports.isBackOffice = (req, res, next) => {
  const allowedRoles = ["admin", "backoffice"];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    return ResponseWrapper.unauthorized(
      res,
      "Akses ditolak. Hanya admin dan backoffice yang diizinkan."
    );
  }
};
