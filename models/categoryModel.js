import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, "Category must have a unique name"],
    required: [true, "Category must have a name"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Category must have a title property"],
  },
  identifer: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);
