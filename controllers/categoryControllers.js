const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const exist = await categoryModel.findOne({ name });
    if (exist) {
      return res.status(400).send({
        status: false,
        message: "Category name already exist.",
      });
    }
    req.body.slug = slugify(name);
    req.body.createdBy = req.body.user._id;
    const category = await categoryModel.create(req.body);
    if (category) {
      return res.status(201).send({
        status: true,
        message: "Category created successfully.",
        data: category,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Category not created.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in createCategoryController api ${error}`,
    });
  }
};
const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isActive: 1 })
      .sort({ createdAt: -1 });
    if (categories.length > 0) {
      return res.status(200).send({
        status: true,
        message: "Category list.",
        data: categories,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "No categories were found.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in getCategoryController api ${error}`,
    });
  }
};
const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.findOne({ slug });
    if (category) {
      return res.status(200).send({
        status: true,
        message: "Category found.",
        data: category,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "No Category found.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in singleCategoryController api ${error}`,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id } = req.params;
    req.body.slug = slugify(name);
    const categoryUpdate = await categoryModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );
    if (categoryUpdate) {
      return res.status(200).send({
        status: true,
        message: "Category updated successfully.",
        data: categoryUpdate,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Category didn't update.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in updateCategoryController api ${error}`,
    });
  }
};
const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedCategory = await categoryModel.findByIdAndDelete(_id);
    if (deletedCategory) {
      return res.status(200).send({
        status: true,
        message: "Category deleted successfully.",
        data: deletedCategory,
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "Category not deleted.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: `Error in deleteCategoryController api ${error}`,
    });
  }
};
module.exports = {
  createCategoryController,
  getCategoryController,
  singleCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
