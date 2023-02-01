import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "each lecture should have title"],
  },
  number: {
    type: Number,
    required: [true, "each lecture should have lecture number"],
  },
  duration: {
    type: String,
    required: [true, "each lecture should have duration defined"],
  },
  storage_id : {
    type: String,
    required: true,
    select : false
  },
  lecture_id: {
    type: String,
    select : false
  },
  slug: {
    type: String,
    required: [true, 'Each course must have slug'],
    select : false
  },
  course : {
    type: mongoose.Schema.ObjectId,
    ref: 'CourseDetail',
    required : [true, 'lecture must belong to course']
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "course must have title"],
  },
  slug: {
    type: String,
    required: [true, "course must have slug field"],
    unique: [true, "each course slug must be unique"],
    select: false,
  },
  source: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  released_date: {
    type: String,
  },
  total_lectures: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    select: false
  },
  status: {
    type: String,
    required : [true, 'Each course must have status']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.virtual('lectures', {
  ref: 'Lecture',
  foreignField: 'course',
  localField: '_id'
});

export const Course =  mongoose.model("Course", courseSchema);
export const Lecture = mongoose.model("Lecture", lectureSchema);
