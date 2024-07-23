import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id; // Assuming user is authenticated

  const like = await Like.findOne({ user: userId, contentId: videoId, contentType: 'video' });

try {
    if (like) {
      // User already liked the video, so unlike it
      await Like.deleteOne({ _id: like._id });
      res.status(200).json(new ApiResponse(true, 'Video unliked'));
    } else {
      // User didn't like the video, so like it
      await Like.create({ user: userId, contentId: videoId, contentType: 'video' });
      res.status(201).json(new ApiResponse(true, 'Video liked'));
    }
} catch (error) {
  throw new ApiError(500, error.message);
}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id; // Assuming user is authenticated

  const like = await Like.findOne({ user: userId, contentId: commentId, contentType: 'comment' });

  try {
    if (like) {
      // User already liked the comment, so unlike it
      await Like.deleteOne({ _id: like._id });
      res.status(200).json(new ApiResponse(true, 'Comment unliked'));
    } else {
      // User didn't like the comment, so like it
      await Like.create({ user: userId, contentId: commentId, contentType: 'comment' });
      res.status(201).json(new ApiResponse(true, 'Comment liked'));
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id; // Assuming user is authenticated

  const like = await Like.findOne({ user: userId, contentId: tweetId, contentType: 'tweet' });

  try {
    if (like) {
      // User already liked the tweet, so unlike it
      await Like.deleteOne({ _id: like._id });
      res.status(200).json(new ApiResponse(true, 'Tweet unliked'));
    } else {
      // User didn't like the tweet, so like it
      await Like.create({ user: userId, contentId: tweetId, contentType: 'tweet' });
      res.status(201).json(new ApiResponse(true, 'Tweet liked'));
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming user is authenticated

  const likedVideos = await Like.find({ user: userId, contentType: 'video' })
    .populate('contentId') // Populate the video object
    .select('contentId'); // Select only the video ID

  res.status(200).json(new ApiResponse(true, 'Liked videos fetched', likedVideos));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};





































