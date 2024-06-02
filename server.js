const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongodbConnect = require("./config/db");
const testRouter = require("./routes/testRoutes");
const authRouter = require("./routes/authRoutes");
const config = require("./config/config");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const orderRouter = require("./routes/orderRoutes");
const os = require("os");
const path = require("path");

// configure dotenv
dotenv.config();

// define port
const PORT = config.PORT || 3002;

// create a server
const app = express();

// using middlewares
app.use(cors());
app.use(express.json());
const CURRENT_WORKING_DIR = process.cwd();
app.use('/files', express.static(path.join(CURRENT_WORKING_DIR, 'files')));
// app.use(formidableMiddleware());

// home route
app.get("/", (req, res) => {
  res.status(200).send({
    status: true,
    message: "This domains api is created & managed by @hemantmewada",
    numOfCpus: os.cpus().length,
  });
});

// other routes
app.use("/api", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);

mongodbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`.bgGreen);
  });
});
