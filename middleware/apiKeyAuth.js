const ResponseWrapper = require("../utils/responseWrapper");

const apiKeyAuth = (req, res, next) => {
  console.log("Masuk ke middleware apiKeyAuth");
  try {
    const receivedApiKey = req.header("X-API-Key");
    const expectedApiKey =
      process.env.API_KEY ||
      "370206ca2c732df05f8d704752148e328bc7998beab32d298e1db3ae1f87541f";

    if (!receivedApiKey || receivedApiKey !== expectedApiKey) {
      return ResponseWrapper.unauthorized(res, "Invalid API Key");
    }

    console.log("API Key valid, melanjutkan ke controller");
    next();
  } catch (error) {
    console.error("Error dalam apiKeyAuth:", error);
    return ResponseWrapper.error(res, "Authentication failed", error);
  }
};

// Export function langsung
module.exports = apiKeyAuth;
