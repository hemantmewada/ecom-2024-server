const express = require("express");
const {testController, scrapeData, scrapedData, scrapedSingleData} = require("../controllers/testControllers");

const testRouter = express.Router();

testRouter.post("/test", testController);
testRouter.post("/website-scrape", scrapeData);
testRouter.get("/website-scrape-list", scrapedData);
testRouter.get("/website-scrape-single/:_id", scrapedSingleData);

module.exports = testRouter;
