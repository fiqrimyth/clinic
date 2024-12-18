const jwt = require("jsonwebtoken");
const ResponseWrapper = require("../utils/responseWrapper");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json(ResponseWrapper.error("Token tidak ditemukan", null, 401));
  }

  const token = authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(ResponseWrapper.error("Token tidak valid", null, 401));
  }
};
