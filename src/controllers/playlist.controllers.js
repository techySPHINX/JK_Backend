import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const playlist = await Playlist.create({
    name,
    description,
    userId: req.user._id 
  })

  res.status(201).json(new ApiResponse(playlist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, 'Invalid userId')
  }

  const playlists = await Playlist.find({ userId })

  res.json(new ApiResponse(playlists))
})

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlistId')
  }

  const playlist = await Playlist.findById(playlistId)

  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }

  res.json(new ApiResponse(playlist))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid playlistId or videoId')
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { videos: videoId } },
    { new: true }
  )

  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  } 

  res.json(new ApiResponse(playlist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, 'Invalid playlistId or videoId')
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  )

  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }

  res.json(new ApiResponse(playlist))
})

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlistId')
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId)

  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }

  res.status(204).send()
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params
  const { name, description } = req.body

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, 'Invalid playlistId')
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  )

  if (!playlist) {
    throw new ApiError(404, 'Playlist not found')
  }

  res.json(new ApiResponse(playlist))
})

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist
}
