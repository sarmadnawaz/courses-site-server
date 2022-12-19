import Category from "../models/categoryModel.js";
import jwt from "jsonwebtoken";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `${err.message}`,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { title, name } = req.body;
    const identifer = jwt.sign({ name }, process.env.PRIVATE_KEY);
    const category = await Category.create({
      name,
      title,
      identifer,
    });
    res.status(200).json({
      status: "success",
      message: "category has been created successfully",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `${err.message}`,
    });
  }
};
