const express = require("express");
const convert = require("heic-convert");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const port = 3001;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cors({ allowedHeaders: "*" }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

async function fromHEICToJPEG(inputBuffer) {
  try {
    const data = await convert({
      buffer: inputBuffer,
      format: "JPEG",
      quality: 1,
    });

    return data;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    throw error;
  }
}

app.post("/", upload, async (req, res) => {
  try {
    const jpegBuffer = await fromHEICToJPEG(req.file.buffer);
    res.send(jpegBuffer);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
