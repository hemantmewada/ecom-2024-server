const fs = require("fs");
const productModel = require("../models/productModel");
const slugify = require("slugify");

// create a product
const createProductController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { image } = req.files;
    if (!image) {
      return res.status(404).send({
        status: false,
        message: "Product image is required.",
        image,
      });
    }
    req.fields.slug = slugify(name);
    req.fields.createdBy = req.body.user._id;
    const product = new productModel(req.fields);
    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }
    const productSave = await product.save();
    if (productSave) {
      return res.status(201).send({
        status: true,
        message: "Product created successfully.",
        data: productSave,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Product not created.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in createProductController api: ${error}`,
      error,
    });
  }
};

// get all products
const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({ isActive: 1 })
      // .select("-image")
      .select({ image: 0 })
      .populate("category")
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        totalProductsCount: products.length,
        data: products,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "No products were found.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getAllProductsController api ${error}`,
    });
  }
};

// get single products
const getSingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug, isActive: 1 })
      .select({ image: 0 });
    if (product) {
      return res.status(200).send({
        status: true,
        message: "Product found.",
        data: product,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "No product were found.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getSingleProductController api ${error}`,
    });
  }
};

// get image
const getImageController = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await productModel.findOne({ _id, isActive: 1 });
    if (product) {
      res.set("Content-type", product.image.contentType);
      return res.status(200).send(product.image.data);
    } else {
      return res.status(404).send({
        status: false,
        message: "No product image were found.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getSingleProductController api ${error}`,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedProduct = await productModel
      .findByIdAndDelete(_id)
      .select({ image: 0 });
    if (deletedProduct) {
      return res.status(200).send({
        status: true,
        message: "Product deleted successfully.",
        data: deletedProduct,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Product not deleted.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in deleteProductController api ${error}`,
    });
  }
};
// update a product
const udpateProductController = async (req, res) => {
  try {
    const { name } = req.fields;
    const { image } = req.files;
    const { _id } = req.params;
    req.fields.slug = slugify(name);
    const product = await productModel.findByIdAndUpdate(_id, req.fields, {
      new: true,
    });
    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }
    const productUpdate = await product.save();
    if (productUpdate) {
      return res.status(201).send({
        status: true,
        message: "Product updated successfully.",
        data: productUpdate,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Product not update.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in udpateProductController api: ${error}`,
      error,
    });
  }
};
module.exports = {
  createProductController,
  getAllProductsController,
  getSingleProductController,
  getImageController,
  deleteProductController,
  udpateProductController,
};
