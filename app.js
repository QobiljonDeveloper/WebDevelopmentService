const express = require("express");
const config = require("config");
const PORT = config.get("port");
const sequelize = require("./config/db");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index.routes");

const requestLogger = require("./middlewares/loggers/request.logger");
const errorLogger = require("./middlewares/loggers/request.error.logger");

const errorHandlingMiddleware = require("./middlewares/error/error.handling.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use("/api", indexRouter);

app.use(errorLogger);

app.use(errorHandlingMiddleware);
async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Serverda xatolik:", error);
  }
}

start();
