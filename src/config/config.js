const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
const path = require("path");

// Ensure the public directory exists
let rootDir = path.join(__dirname, "..", "..");
let rootPublicDir = path.join(rootDir, "public");
if (!fs.existsSync(rootPublicDir)) {
  fs.mkdirSync(rootPublicDir, { recursive: true });
  console.log(
    `================================\n\nPublic directory created at ${rootPublicDir}\n\n================================`
  );
}

// Ensure the logs directory exists
let rootLogsDir = path.join(rootDir, "logs");
if (!fs.existsSync(rootLogsDir)) {
  fs.mkdirSync(rootLogsDir, { recursive: true });
  console.log(
    `================================\n\nLogs directory created at ${rootLogsDir}\n\n================================`
  );
}

//Check the whitelist
// const whitelist = ["http://localhost:5173"];
// if (process.env.NODE_ENV !== "production") {
//   whitelist = ["http://localhost:5173"];
// } else {
//   whitelist = ["http://52.66.36.66"];
// }
// const whitelist =
//   process.env.NODE_ENV !== "development"
//     ? ["http://52.66.36.66"]
//     : [process.env.WEB_CLIENT_URL];
const whitelist = ["http://52.66.36.66", "http://localhost:5173"];
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  directories: {
    rootDir,
    rootPublicDir,
    rootLogsDir,
  },
  webClientUrl: process.env.WEB_CLIENT_URL,
  cors: {
    corsOptions: {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          //for web servers like react front end(allowedOrigins-whitelist) and mobile clients with no origins
          callback(null, true); // Allow the request
        } else {
          callback(new Error("Not allowed by CORS")); // Block the request
        }
      },
      credentials: true, // Include this if you need to send cookies
      // allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
  mongoose: {
    db_url: process.env.MONGODB_URL,
    clientOptions: {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    },
  },
  encryption: {
    bcrypt_salt: process.env.BCRYPT_SALT,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_USER,
    email_service: process.env.SMTP_EMAIL_SERVICE,
  },
  jwt: {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(
        Date.now() + parseInt(process.env.JWT_DEFAULT_EXPIRATION) * 1000
      ),
      // sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      // domain: "localhost:4000",
      // partitioned: true,
    },
    secret: process.env.JWT_SECRET,
    defaultExpiration: process.env.JWT_DEFAULT_EXPIRATION,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
    resetPasswordExpiration: process.env.JWT_RESET_PASSWORD_EXPIRATION,
    tokenTypes: {
      ACCESS: "access",
      REFRESH: "refresh",
      RESET_PASSWORD: "resetPassword",
      VERIFY_EMAIL: "verifyEmail",
    },
  },
};
