const productModel = require("../models/productModel");
const Data = require("../models/data");
const Author = require("../models/author");
const Book = require("../models/book");
const Company = require("../models/Company");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const axios = require("axios");
const { capitalizeFirstLetter } = require("../helpers/commonHelper");
const fs = require("fs");

const document = {
  index: 999999,
  name: "hemant mewada",
  isActive: false,
  registered: new Date(),
  age: 24,
  gender: "male",
  eyeColor: "black",
  favoriteFruit: "grapes",
  company: {
    title: "test title",
    email: "testmail@gmail.com",
    phone: "+91 7415119928",
    location: {
      country: "India",
      address: "nimad nagar itawa dewas",
    },
  },
};
const testController = async (req, res) => {
  try {
    // const page = 2;
    // const pageSize = 10;
    // const skip = (page - 1) * pageSize;
    // const limit = pageSize;

    // const data = await Data.aggregate([{ $skip: skip }, { $limit: limit }]);
    // const data = await Data.aggregate([
    //   {
    //     $group: {
    //       // sum of all group by favoriteFruit
    //       // _id: "$favoriteFruit",
    //       // count: {
    //       //   $sum: 1,
    //       // },
    //       // avg of age
    //       // _id: null,
    //       // avgAge: {
    //       //   $avg: "$age",
    //       // },
    //       // _id: "$gender",
    //       // _id: null,
    //       // count: {
    //       //   $sum: 1,
    //       // },
    //       // _id: "$company.location.country",
    //       // count: {
    //       //   $sum: 1,
    //       // },
    //       // _id: "$tags",
    //     },
    //   },
    //   // { $sort: { count: -1 } },
    //   // { $limit: 1 },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $unwind: "$tags",
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       numOfTags: {
    //         $sum: 1,
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       avg: {
    //         $avg: "$numOfTags",
    //       },
    //     },
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $match: {
    //       tags: "enim",
    //     },
    //   },
    //   {
    //     $count: "userCountWithEnimTags",
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   { $match: { isActive: false, tags: "velit" } },
    //   { $project: { name: 1, age: 1, _id: 0 } },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $match: {
    //       "company.phone": /^\+1\s*\(940\)/,
    //     },
    //   },
    //   {
    //     $count: "userCountPhoneStartsWith",
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $sort: {
    //       registered: -1,
    //     },
    //   },
    //   { $limit: 1 },
    //   {
    //     $project: {
    //       name: 1,
    //       registered: 1,
    //     },
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $group: {
    //       _id: "$favoriteFruit",
    //       count: {
    //         $sum: 1,
    //       },
    //       users: {
    //         $push: "$name",
    //       },
    //     },
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $match: {
    //       "tags.1": "ad",
    //     },
    //   },
    //   { $count: "usersWithTagsAdAtSecondPosition" },
    // ]);
    // const data = Data.aggregate([
    //   {
    //     $match: {
    //       tags: { $all: ["enim", "id"] },
    //     },
    //   },
    // ]);
    // const data = await Data.aggregate([
    //   {
    //     $match: {
    //       "company.location.country": "USA",
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$company.title",
    //       userCount: {
    //         $sum: 1,
    //       },
    //     },
    //   },
    //   // {
    //   //   $count: "userCount",
    //   // },
    // ]);
    const data = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "author_id",
          foreignField: "_id",
          as: "author_details",
        },
      },
      {
        $addFields: {
          author_details: {
            $arrayElemAt: ["$author_details", 0],
          },
        },
      },
    ]);
    // const saved = await data.save();
    // const deleted = await Data.findOneAndDelete({ favoriteFruit: "grapes" });
    return res.status(200).send({
      status: true,
      message: "This route is just for testing purpose",
      count: data.length,
      // deletedcount: deleted,
      data,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error caugth : ${error}`,
      error,
    });
  }
};
const scrapeData = async (req, res) => {
  try {
    const {url} = req.body;
    const exist = await Company.findOne({url});
    if (exist) {
      return res.status(409).json({
        status: false,
        message: "Already fetched data for this URL",
        url,
      });
    }
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const contactDetails = {icon:null,url,title:null,description:null,fb:null,insta:null,twitter:null,linkedin:null,phone:null,email:null,screenshot:null};
    contactDetails.title = capitalizeFirstLetter(url.split("//")[1].replace("www.","").split(".")[0]);
    contactDetails.description = $('meta[name="description"]').attr("content");
    let icon = $('link[rel="icon"]').attr("href");
    if (!icon?.startsWith("htt") && icon != undefined) {
      icon = url + icon;
    }
    contactDetails.icon = icon;
    const fb = $('a[href*="facebook.com"]').attr('href');
    if (fb) contactDetails.fb = fb;
    const insta = $('a[href*="instagram.com"]').attr('href');
    if (insta) contactDetails.insta = insta;
    const twitter = $('a[href*="twitter.com"]').attr('href');
    if (twitter) contactDetails.twitter = twitter;
    const linkedin = $('a[href*="linkedin.com"]').attr('href');
    if (linkedin) contactDetails.linkedin = linkedin;
    const phone = $('a[href^="tel:"]').attr('href');
    if (phone) contactDetails.phone = phone.replace('tel:', '');
    if (!phone) {
        const wa = $('a[href^="https://wa.me"]').attr("href");
        if (wa) contactDetails.phone = wa.replace('https://wa.me/', '');
    }
    const email = $('a[href^="mailto:"]').attr('href');
    if (email) contactDetails.email = email.replace('mailto:', '');
    // console.log(contactDetails);
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto(url);
    // const screenshot = await page.screenshot({ encoding: 'base64' });
    // await browser.close();
    // console.log($);
    const fileUrl = `files/${contactDetails.title}.html`;
    fs.writeFile(fileUrl, data, (err) => err && console.error(err));
    contactDetails.screenshot = fileUrl;
    const company = new Company({...contactDetails});
    const savedCompany = await company.save();
    return res.status(200).send({
      status: true,
      message: "Latest saved company",
      data: savedCompany,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error caugth : ${error}`,
      error,
    });
  }
};
const scrapedData = async (req, res) => {
  try {
    const savedCompanies = await Company.find({});
    return res.status(200).send({
      status: true,
      message: "All companies",
      count: savedCompanies.length,
      data: savedCompanies,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error caugth : ${error}`,
      error,
    });
  }
};
const scrapedSingleData = async (req, res) => {
  try {
    const {_id} = req.params;
    const company = await Company.findById(_id);
    return res.status(200).send({
      status: true,
      message: "single company",
      data: company,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error caugth : ${error}`,
      error,
    });
  }
};

module.exports = {testController, scrapeData, scrapedData, scrapedSingleData};
