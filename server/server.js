require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const database = require("./config/db");
const AuthRoute = require("./routes/AuthRoute");
const UserRoute = require("./routes/UserRoute");
const ProductRoutes = require("./routes/ProductRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const BlogRoutes = require("./routes/BlogRoutes");
const UploadRoute = require("./routes/UploadRoute");
const PaymentRoutes = require("./routes/PaymentRoutes");
const WishlistRoute = require("./routes/WishlistRoute");

const app = express();
database.connect();

// Middleware
const corsOptions = {
  origin: (origin, callback) => {
    // No origin (server-to-server, Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // Development: Allow all localhost ports
    const isLocalhost = origin.startsWith("http://localhost:");

    // Production: Check against CLIENT_URL
    const isProduction =
      process.env.CLIENT_URL && origin === process.env.CLIENT_URL;

    if (isLocalhost || isProduction) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true, // Allow cookies (refreshToken httpOnly cookie)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", AuthRoute);
app.use("/api/users", UserRoute);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/upload", UploadRoute);
app.use("/api/payment", PaymentRoutes);
app.use("/api/wishlist", WishlistRoute);

// Server setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
