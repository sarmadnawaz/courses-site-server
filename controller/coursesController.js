import fs from 'fs';
import APIFeatures from "../utilz/apiFeatures.js";
import catchAsync from "../utilz/catchAsync.js";
import AppError from '../utilz/appError.js';
import { Course , Lecture } from "../models/courseModel.js";


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
  const [courses, totalCourses] = await Promise.all([
    features.query,
    features.totalDocQuery,
  ]);
  res.status(200).json({
    status: "sucess",
    totalDocs: totalCourses,
    data: {
      data: courses,
    },
  });
};

export const getCourse = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  let selectOptions = [];
  let lectures = [];
  
  const course = await Course.findOne({ slug });
  if (!course) return next(new AppError('Document Not Found', 404))
  if (course.status === 'premium' && (req.user.plan === 'premium')) {
    selectOptions.push('+storage_id', '+slug');    
  } else if (course.status === 'standard' && (req.user.plan === 'premium' || req.user.plan === 'standard')) {
    selectOptions.push('+storage_id', '+slug')
  } else if (course.status === 'free') {
    selectOptions.push('+storage_id', '+slug');
  } else {
    return next(new AppError(`This course is only for ${course.status} plan subscribers. Thank you 🫡`, 401))
  }

  if (selectOptions.length > 0) {
    lectures = await Lecture.find({ course: course._id }).select(selectOptions.join(' '))
  } else lectures = await Lecture.find({ course: course._id });

  res.status(200).json({
    status: "sucess",
    data: {
        course,
        lectures
    },
  });
});

// let courses = fs.readFileSync('./assests/course.json', 'utf-8')
// courses = JSON.parse(courses);

export const createCourses = catchAsync(async (req, res, next) => {
  // req.body = courses;
  for (let i = 0; i < req.body.length; i++){
    let course = req.body[i];
    let lectures = course.lectures;
    const courseDoc = await Course.create(course);
    lectures = lectures.map(lecture => ({ ...lecture, course : courseDoc._id }))
    const lecturesDoc = await Lecture.create(lectures);
  }
  res.status(200).json({
    status: "success",
  });
});



export const deleteLectures = catchAsync(async (req, res, next) => {
  await Lecture.deleteMany();
  res.status(200).json({
    status: "success"
  });
});

export const deleteCourses = catchAsync(async (req, res, next) => {
  await Course.deleteMany();
  res.status(200).json({
    status: "success"
  });
});

export const getCoursesByTopic = catchAsync(async (req, res, next) => {});
