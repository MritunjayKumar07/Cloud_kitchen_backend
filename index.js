const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const Connection = require("./src/DB_Connect/db.js");
const ProductRoutes = require("./src/Routes/Products.js");
const UserRoutes = require("./src/Routes/Users.js");
const OrderRoutes = require("./src/Routes/Orders.js");
const FeedbackRoutes = require("./src/Routes/Feedback.js");
const ComplainRoutes = require("./src/Routes/Complaint.js");
const ReviewRoutes = require("./src/Routes/Review.js");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:9001",
  "http://codecomponents.in",
  "http://localhost:" + process.env.PORT,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Use body-parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// API Key Middleware
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["app-api-key"];

  if (!apiKey || apiKey !== process.env.APP_API_KEY) {
    return res.status(401).json({ error: "Unauthorized - Invalid API key" });
  }

  next();
};

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// API Key Authentication Middleware
app.use(apiKeyMiddleware);

// Routes and other middleware can be added here
app.post("/", (req, res, next) => {
  res.status(200).json({ message: "DataBase Connection Successfully..." });
});

app.use("/users", UserRoutes);
app.use("/orders", OrderRoutes);
app.use("/products", ProductRoutes);
app.use("/complain", ComplainRoutes);
app.use("/reviews", ReviewRoutes);
app.use("/feedback", FeedbackRoutes);

// Database Connection
Connection();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Set Port
const PORT = process.env.PORT || 9000;

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running successfully on PORT ${PORT}`);
});
