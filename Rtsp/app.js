// const path = require("path");
// const { spawn } = require("child_process");
// const ffmpegPath = require("ffmpeg-static");
// const axios = require("axios");
// const fs = require("fs");

// // RTSP URL of the camera feed
// const rtspUrl = "rtsp://admin:Admin@123@192.168.1.69:554/1";

// // Directory to store captured frames
// const outputDirectory = "./frames";

// // Backend API endpoint to send base64 images
// const backendUrl = "http://13.235.16.68/webcamFeed";

// if (!fs.existsSync(outputDirectory)) {
//   fs.mkdirSync(outputDirectory);
// }

// // Function to convert an image to base64
// function imageToBase64(imagePath) {
//   const imageData = fs.readFileSync(imagePath);
//   return Buffer.from(imageData).toString("base64");
// }

// // console.log(imageToBase64, "------------");

// // Function to send base64 image to the backend
// async function sendBase64ImageToBackend(base64Image) {
//   try {
//     // Send the base64 image to the backend
//     const response = await axios.post(backendUrl, {
//       image: base64Image,
//     });
//     // console.log(response, "api-------------");

//     console.log("Image sent to the backend:", response.config.data);
//   } catch (error) {
//     console.error("Error sending image to the backend:", error);
//   }
// }

// // Create an FFmpeg process to capture frames
// const ffmpegCommand = [
//   "-i",
//   rtspUrl,
//   "-vf",
//   //"fps=30", // Adjust the frame capture rate as needed
//   "fps=12",
//   `${outputDirectory}/frame.jpg`,
// ];
// // const ffmpegCommand = [
// //   "-i",
// //   rtspUrl,
// //   "-vf",
// //   "fps=30",
// //   "-err_detect",
// //   "ignore_err",
// //   "-max_error_rate",
// //   "0.1", // Set maximum error rate to 10%
// //   `${outputDirectory}/frame-%03d.jpg`,
// // ];

// const ffmpegProcess = spawn(ffmpegPath, ffmpegCommand);

// ffmpegProcess.stdout.on("data", (data) => {
//   console.log(`FFmpeg stdout: ${data}`);
// });

// ffmpegProcess.stderr.on("data", (data) => {
//   console.error(`FFmpeg stderr: ${data}`);
// });

// ffmpegProcess.on("close", (code) => {
//   console.log(`FFmpeg process exited with code ${code}`);
// });

// // Check for new frames and send them to the backend
// setInterval(() => {
//   fs.readdir(outputDirectory, (err, files) => {
//     if (err) {
//       console.error("Error reading frames directory:", err);
//       return;
//     }

//     // Iterate through the frames and send each one to the backend
//     files.forEach((file) => {
//       const imagePath = path.join(outputDirectory, file);
//       const base64Image = imageToBase64(imagePath);
//       sendBase64ImageToBackend(base64Image);

//       // Optionally, you can remove the file after sending it to the backend
//       // fs.unlinkSync(imagePath);
//     });
//   });
// }, 1000 / 12); // Adjust the interval as needed (e.g., 1000 ms = 1 second)

const path = require("path");
const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const axios = require("axios");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the "public" folder

// RTSP URL of the camera feed (initially empty)
let rtspUrl = "";

// Directory to store captured frames
const outputDirectory = "./frames";

// Backend API endpoint to send base64 images
const backendUrl = "http://13.235.16.68/webcamFeed";

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Function to convert an image to base64
function imageToBase64(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  return Buffer.from(imageData).toString("base64");
}

// Function to send base64 image to the backend
async function sendBase64ImageToBackend(base64Image) {
  try {
    // Send the base64 image to the backend
    const response = await axios.post(backendUrl, {
      image: base64Image,
    });

    console.log("Image sent to the backend:", response.config.data);
  } catch (error) {
    console.error("Error sending image to the backend:", error);
  }
}

// Create an FFmpeg process to capture frames
function startFfmpeg() {
  const ffmpegCommand = [
    "-i",
    rtspUrl,
    "-vf",
    "fps=12",
    `${outputDirectory}/frame.jpg`,
  ];

  const ffmpegProcess = spawn(ffmpegPath, ffmpegCommand);

  ffmpegProcess.stdout.on("data", (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
}

// Handle form submission to set the RTSP URL
app.post("/setRtspUrl", (req, res) => {
  rtspUrl = req.body.rtspUrl;
  startFfmpeg(); // Restart FFmpeg with the new RTSP URL
  res.redirect("/"); // Redirect back to the main page
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
