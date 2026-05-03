import asyncHandler from "../utils/asyncHandler.js";
import adminTrackService from "../services/adminTrack.service.js";

export const uploadTrack = asyncHandler(async (req, res) => {
  const result = await adminTrackService.create({
    userId: req.user.id,
    body: req.body,
    files: req.files
  });
  res.status(201).json(result);
});

export const getTracks = async (req, res, next) => {
  try {
    const result = await adminTrackService.getAll({ userId: req.user.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
};