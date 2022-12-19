import jwt from "jsonwebtoken";
import axios from "axios";

export const getImage = async (req, res) => {
  const { name } = req.params;
  const { type = "category-image", size = "150x150" } = req.query;
  // Generate a url
  const imageUrl = `${process.env.CDN_BASE_URL}/${
    type === "course-image" ? "courses" : "categories"
  }/${size}/${name}.jpg`;
  const response = await axios.get(imageUrl, { responseType: "stream" });
  response.data.pipe(res);
};
