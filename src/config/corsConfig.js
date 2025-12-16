const cors = require("cors");
const ENV = require("./env");

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",

  "https://interior-design-website-umber.vercel.app",
];

const corsMiddleware = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed: " + origin));
    }
  },
  credentials: true,
});

module.exports = corsMiddleware;
