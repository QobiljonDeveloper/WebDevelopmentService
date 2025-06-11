const logger = require("../../services/logger.service");
const ApiError = require("./ApiError");
module.exports = function (err, req, res, next) {
  console.error(err);
  logger.error(err.message || err);

  if (err instanceof ApiError) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).send({ message: err.message });
  }

  return res.status(500).send({ message: "Nazarda tutilmagan hatolik" });
};
