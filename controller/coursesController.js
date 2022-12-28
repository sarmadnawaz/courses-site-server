import Course from "../models/courseModel.js";
import APIFeatures from "../utilz/apiFeatures.js";

export const getCourses = async (req, res) => {
  const features = new APIFeatures(
    Course.find(),
    Course.countDocuments(),
    req.query
  )
    .sanitize()
    .search()
    .filter()
    .paginate();
  const courses = await features.query;

  const totalCourses = await features.totalDocQuery;
  res.status(200).json({
    status: "sucess",
    data: {
      totalCourses,
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
