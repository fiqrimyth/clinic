const crypto = require("crypto");

const generateApiKey = () => {
  const apiKey = crypto.randomBytes(32).toString("hex");
  console.log("Generated API Key:", apiKey);
  console.log("Simpan key ini di file .env sebagai API_KEY=", apiKey);
};

generateApiKey();
