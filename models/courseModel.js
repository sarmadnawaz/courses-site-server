import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  status: String,
  title: String,
  coverImage: String,
  baseUrl: String,
  duration: String,
  description: String,
  language: String,
  sourceName: String,
  category: String,
});

export default mongoose.model("Course", courseSchema);
