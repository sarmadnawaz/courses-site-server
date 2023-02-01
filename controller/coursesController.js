import Course from "../models/courseModel.js";
import APIFeatures from "../utilz/apiFeatures.js";
import catchAsync from "../utilz/catchAsync.js";

export const getCourses = async (req, res) => {
  const features = new APIFeatures(
    Course.find(),
    Course.countDocuments(),
    req.query
  )
    .sanitize()
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

// GET COURSES BY CATEGORY BASE
export const getCoursesByCategory = catchAsync(async (req, res, next) => {
  req.query.category = req.params.category;
  const features = new APIFeatures(
    Course.find(),
    Course.countDocuments(),
    req.query
  )
    .sanitize()
    .filter()
    .paginate();
  const [courses, totalCourses] = await Promise.all([
    features.query,
    features.totalDocQuery,
  ]);

  res.status(200).json({
    status: "success",
    totalDocs: totalCourses,
    data: {
      data: courses,
    },
  });
});

// GET COURSES BY SEARCH
export const getCoursesBySearch = catchAsync(async (req, res, next) => {
  if (req.query.q) {
    req.query.search = req.query.q;
  } else req.query.search = undefined;
  console.log(req.query);
  const features = new APIFeatures(
    Course.find(),
    Course.countDocuments(),
    req.query
  )
    .sanitize()
    .search()
    .filter()
    .paginate();
  const [courses, totalCourses] = await Promise.all([
    features.query,
    features.totalDocQuery,
  ]);

  res.status(200).json({
    status: "success",
    totalDocs: totalCourses,
    data: {
      data: courses,
    },
  });
});

export const getCoursesByTopic = catchAsync(async (req, res, next) => {});
