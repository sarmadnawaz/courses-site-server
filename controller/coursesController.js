import fs from "fs";
import APIFeatures from "../utilz/apiFeatures.js";
import catchAsync from "../utilz/catchAsync.js";
import AppError from "../utilz/appError.js";
import { Course, Lecture } from "../models/courseModel.js";
import { fetchLectures } from "../utilz/fetch.js";
import { checkLecturesPermission } from '../utilz/utilityFunctions.js';

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
  const { slug } = req.params
  const course = await Course.findOne({ slug }).select("+course_id");
  if (!course) {
    return next(new AppError("Document Not found", 404));
  }
  let url = `https://${process.env.COURSES_SITE}/api/v1/course/${
    course.course_id || "3505"
    }/lessons`;
  
  let lectures = await fetchLectures({ url, req })

  lectures = checkLecturesPermission({ lectures, userPlan : req.user?.plan, courseStatus : course.status})
  
  res.status(200).json({
    status: 'success',
    data: {
      course: {
        course,
        lectures
      }
    }
  })
})

// let courses = fs.readFileSync('./assests/course.json', 'utf-8')
// courses = JSON.parse(courses);

export const createCourses = catchAsync(async (req, res, next) => {
  // req.body = courses;
  for (let i = 0; i < req.body.length; i++) {
    let course = req.body[i];
    let lectures = course.lectures;
    const courseDoc = await Course.create(course);
    lectures = lectures.map((lecture) => ({
      ...lecture,
      course: courseDoc._id,
    }));
    const lecturesDoc = await Lecture.create(lectures);
  }
  res.status(200).json({
    status: "success",
  });
});


export const deleteCourses = catchAsync(async (req, res, next) => {
  await Course.deleteMany();
  res.status(200).json({
    status: "success",
  });
});

