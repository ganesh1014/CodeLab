const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const videoRouter =  express.Router();
const {getVideoStatus, checkVideoExists, generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/videoSection")

//video is uploaded by only admin
videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);
// backend/src/routes/video.js
videoRouter.get('/status', adminMiddleware, getVideoStatus);
videoRouter.get('/check/:problemId', adminMiddleware, checkVideoExists);

module.exports = videoRouter;