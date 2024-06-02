const express = require("express");
const {testController, scrapeData, scrapedData} = require("../controllers/testControllers");

const testRouter = express.Router();

testRouter.post("/test", testController);
testRouter.post("/website-scrape", scrapeData);
testRouter.get("/website-scrape-list", scrapedData);

module.exports = testRouter;
