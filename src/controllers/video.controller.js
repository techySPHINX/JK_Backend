import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js"; // Assuming a User model for ownership
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {};
  if (query) {
    filter.$text = { $search: query };
  }
  if (userId) {
    filter.user = userId;
  }

  const sort = { [sortBy]: sortType === "asc" ? 1 : -1 }; // sorting in ascending order with linited to 10

  const options = {
    page,
    limit,
    sort,
    populate: { path: "user", select: "username profilePicture" },
  };

  try {
    const videos = await Video.paginate(filter, options);
    res.json(new ApiResponse(videos, "Videos retrieved successfully"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(new ApiError("Error retrieving videos", error.message));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.file) {
    throw new ApiError("Please upload a video file");
  } // file is required

  const videoUrl = await uploadOnCloudinary(req.file.path); //upload on cli=oudinary

  try {
    const user = await User.findById(req.user.id);

    const createdVideo = await Video.create({
      title,
      description,
      videoUrl,
      user: user._id,
      published: true,
    });

    res.json(new ApiResponse(createdVideo, "Video published successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiError("Error publishing video", error.message));
  }
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
      throw new ApiError("Invalid video ID");
    }
  
    try {
      const video = await Video.findById(videoId).populate("user", "username profilePicture"); // Populate user details
      if (!video) {
        throw new ApiError("Video not found", 404);
      }
  
      res.json(new ApiResponse(video, "Video retrieved successfully"));
    } catch (error) {
      console.error(error);
      if (error.name === "CastError") {
        res.status(400).json(new ApiError("Invalid video ID"));
      } else {
        res.status(error.statusCode || 500).json(new ApiError("Error retrieving video", error.message));
      }
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, thumbnail } = req.body; // Include optional thumbnail update
  
    if (!isValidObjectId(videoId)) {
      throw new ApiError("Invalid video ID");
    }
  
    const updates = { title, description };
  
    try {
      // Handle potential video/thumbnail updates
      if (req.file) { // If a new video file is uploaded
        const videoUrl = await uploadOnCloudinary(req.file.path);
        updates.videoUrl = videoUrl;
  
        // Optionally delete the existing video from Cloudinary based on its URL/reference
        // ... (Implement Cloudinary deletion logic based on your storage approach) ...
      }
  
      if (thumbnail) { // If a new thumbnail URL is provided
        updates.thumbnail = thumbnail;
      }
  
      const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, { new: true }).populate(
        "user",
        "username profilePicture"
      ); // Return updated video with populated user details
      if (!updatedVideo) {
        throw new ApiError("Video not found", 404);
      }
  
      res.json(new ApiResponse(updatedVideo, "Video updated successfully"));
    } catch (error) {
      console.error(error);
      if (error.name === "CastError") {
        res.status(400).json(new ApiError("Invalid video ID"));
      } else {
        res.status(error.statusCode || 500).json(new ApiError("Error updating video", error.message));
      }
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError("Invalid video ID");
  }

  try {
    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
      throw new ApiError("Video not found", 404);
    }

    res.json(new ApiResponse(deletedVideo, "Video deleted successfully"));
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      res.status(400).json(new ApiError("Invalid video ID"));
    } else {
      res
        .status(error.statusCode || 500)
        .json(new ApiError("Error deleting video", error.message));
    }
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError("Invalid video ID");
  }

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError("Video not found", 404);
    }

    video.published = !video.published; // Toggle
    const updatedVideo = await video.save();

    res.json(
      new ApiResponse(
        updatedVideo,
        video.published ? "Video published" : "Video unpublished"
      )
    );
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      res.status(400).json(new ApiError("Invalid video ID"));
    } else {
      res
        .status(error.statusCode || 500)
        .json(new ApiError("Error toggling publish status", error.message));
    }
  }
});

export {
  getAllVideos, // to get all videos on request
  publishAVideo, // to create and publish video
  getVideoById, // get video by specific id
  updateVideo, // update video by taking contents
  deleteVideo, // delete video by taking id__
  togglePublishStatus, // toggle the video to be public or private
};
