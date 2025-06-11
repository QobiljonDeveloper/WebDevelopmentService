const sendErrorResponse = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Serverda xatolik yuz berdi";

  return res.status(statusCode).json({
    message,
  });
};

module.exports = {
  sendErrorResponse,
};
