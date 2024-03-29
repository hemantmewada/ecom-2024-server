const fs = require("fs");
const productModel = require("../models/productModel");
const slugify = require("slugify");
const categoryModel = require("../models/categoryModel");

// create a product
const createProductController = async (req, res) => {
  try {
    const { name, category } = req.fields;
    const categoryDetail = await categoryModel.findById(category);
    if (!categoryDetail) {
      return res.status(404).send({
        status: false,
        messaeg: "Category not found.",
      });
    }
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
      // .limit(8)
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        totalProductsCount: products.length,
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products were found.",
        data: products,
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
      .populate("category")
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

// get all products with filter
const filterProductsController = async (req, res) => {
  try {
    const { checked, price } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (price.length) args.price = { $gte: price[0], $lte: price[1] };
    const products = await productModel
      .find(args)
      .populate("category")
      .find({ isActive: 1 })
      .select({ image: 0 })
      // .limit(8)
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        totalProductsCount: products.length,
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products were found.",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in filterProductsController api ${error}`,
    });
  }
};

// get products accoring to per page
const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({ isActive: 1 })
      .select({ image: 0 })
      .skip((page - 1) * perPage)
      .populate("category")
      .limit(perPage)
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        totalProductsCount: products.length,
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products were found.",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in productListController api ${error}`,
    });
  }
};

// get all products count
const productCountController = async (req, res) => {
  try {
    const products = await productModel.find({ isActive: 1 }).countDocuments();
    if (products) {
      return res.status(200).send({
        status: true,
        message: "All Products Count.",
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products Count were found.",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in productCountController api ${error}`,
    });
  }
};
// get searched products
const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const products = await productModel
      .find({
        isActive: 1,
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .select({ image: 0 });
    if (products) {
      return res.status(200).send({
        status: true,
        message: "All Searched Products.",
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No Searched Products were found.",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in productSearchController api ${error}`,
    });
  }
};

// get related products
const getRelatedProductsController = async (req, res) => {
  try {
    const { productId, categoryId } = req.params;
    const products = await productModel
      .find({ isActive: 1, category: categoryId, _id: { $ne: productId } })
      .select({ image: 0 })
      .populate("category")
      .limit(4)
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        totalProductsCount: products.length,
        data: products,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products were found.",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getAllProductsController api ${error}`,
    });
  }
};

// get category wise products
const getCategoryProductsController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    const products = await productModel
      .find({ isActive: 1, category: category._id })
      .select({ image: 0 })
      .populate("category")
      .sort({ createdAt: -1 });
    if (products.length > 0) {
      return res.status(200).send({
        status: true,
        message: "All Products.",
        data: products,
        category,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No products were found.",
        data: products,
        category,
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getAllProductsController api ${error}`,
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
  filterProductsController,
  productListController,
  productCountController,
  productSearchController,
  getRelatedProductsController,
  getCategoryProductsController,
};
