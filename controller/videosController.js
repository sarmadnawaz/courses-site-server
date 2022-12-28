import axios from "axios";

export const getVideo = async (req, res) => {
  const { name } = req.params;
  const { lecture = 1 } = req.query;
  const videosId = "c7db1040b6674cb60e476ed3381e8010";
  // Generate a url
  const videoURL = `${process.env.STORAGE_URL}/s/${videosId}/${name}/lesson${lecture}.mp4`;
  const response = await axios.get(videoURL, { responseType: "stream" });
  response.data.pipe(res);
};
