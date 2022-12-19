import Course from "../models/courseModel.js";
import APIFeatures from "../utilz/apiFeatures.js";

export const getCourses = async (req, res) => {
  const features = new APIFeatures(Course.find(), req.query)
    .search()
    .filter()
    .paginate();
  const courses = await features.query;

  res.status(200).json({
    status: "sucess",
    data: {
      courses,
    },
  });
};

export const getCourse = async (req, res) => {
  try {
    const { name: title } = req.params;
    const course = await Course.find({ title });
    res.status(200).json({
      status: "sucess",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
