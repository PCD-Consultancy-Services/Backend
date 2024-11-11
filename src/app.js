const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const httpStatus = require("http-status");
const { connectDB } = require("./config/db.config");
const config = require("./config/config");
const { logger, logRequest } = require("./middlewares/logger.middlewares");

const v1Routes = require("./routes/v1");
const {
  notFound,
  errorHandler,
  badJSONHandler,
  errorConverter,
} = require("./middlewares/error.middlewares");

const app = express();

//connect to mongodb server
connectDB();

// set security HTTP headers
app.use(helmet());

//parse cookies
app.use(cookieParser());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// log each request
app.use(logRequest);

app.use(badJSONHandler);

// To remove data using these defaults:
app.use(mongoSanitize());

// gzip compression
// compress all responses
app.use(compression());

// enable cors
app.use(cors(config.cors.corsOptions));

//Base url - get
app.get("/", (req, res) => {
  const statusCode = httpStatus.OK;
  return res.status(statusCode).json({
    success: true,
    code: statusCode,
    message: "Server is running.",
  });
});

//v1 api routes
app.use("/api/v1", v1Routes);

//404
app.use(notFound);

// convert error to ApiError, if needed
app.use(errorConverter);

//central error handler
app.use(errorHandler);

//socket
const server = require("http").createServer(app);
server.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});
