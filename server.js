const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongodbConnect = require("./config/db");
const testRouter = require("./routes/testRoutes");
const authRouter = require("./routes/authRoutes");
const config = require("./config/config");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");

// configure dotenv
dotenv.config();

// define port
const PORT = config.PORT || 3002;

// create a server
const app = express();

// using middlewares
app.use(cors());
app.use(express.json());
// app.use(formidableMiddleware());

// home route
app.get("/", (req, res) => {
  res.status(200).send({
    status: true,
    message: "This domains api is created & managed by @hemantmewada",
  });
});

// other routes
app.use("/api", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

mongodbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`.bgGreen);
  });
});
