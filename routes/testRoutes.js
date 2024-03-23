const express = require("express");
const testController = require("../controllers/testControllers");

const testRouter = express.Router();

testRouter.get("/test", testController);

module.exports = testRouter;
