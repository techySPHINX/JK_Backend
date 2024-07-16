import mongoose, { isValidObjectId } from "mongoose";


import { Like } from "../models/like.model.js";


import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Check if videoId is a valid mongoose ObjectId
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  try {
    // Find the video document (assuming you have a Video model)
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Check if the user has already liked the video
    const likedVideo = await Like.findOne({ video: videoId, user: req.user._id });

    if (likedVideo) {
      // Unlike the video
      await Like.deleteOne({ _id: likedVideo._id });
      video.likes.pull(req.user._id); // Assuming 'likes' is an array in the Video model
      await video.save();
      return ApiResponse(res, 200, "Unliked video successfully");
    } else {
      // Like the video
      const newLike = new Like({ video: videoId, user: req.user._id });
      await newLike.save();
      video.likes.push(req.user._id);
      await video.save();
      return ApiResponse(res, 200, "Liked video successfully");
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Similar validation and logic as in toggleVideoLike, but for comments
  // Assuming you have a Comment model and 'likes' array in it
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  // Similar validation and logic as in toggleVideoLike, but for tweets
  // Assuming you have a Tweet model and 'likes' array in it
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    // Find all videos liked by the user
    const likedVideos = await Like.find({ user: req.user._id }).populate('video'); // Assuming 'video' is a reference field to the Video model

    return ApiResponse(res, 200, likedVideos);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
};
