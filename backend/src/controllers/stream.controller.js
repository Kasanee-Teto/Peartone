import fs from "fs";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import db from "../models/index.js";

const { Track } = db;

export const streamTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const track = await Track.findByPk(id);
  if (!track) throw new ApiError(404, "Track not found");

  if (!track.audioPath) {
    throw new ApiError(400, "This track does not have a local audio file for streaming");
  }

  const filePath = path.resolve(process.cwd(), track.audioPath); 
  if (!fs.existsSync(filePath)) throw new ApiError(404, "Audio file not found on server");

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;
  const contentType = track.mimeType || "audio/mpeg";

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": contentType,
      "Accept-Ranges": "bytes"
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const match = /^bytes=(\d+)-(\d*)$/.exec(range);
  if (!match) throw new ApiError(416, "Invalid Range header");

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

  if (start >= fileSize || start > end) {
    res.status(416).set({
      "Content-Range": `bytes */${fileSize}`
    });
    return res.end();
  }

  const safeEnd = Math.min(end, fileSize - 1);

  const chunkSize = safeEnd - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${safeEnd}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": contentType
  });

  fs.createReadStream(filePath, { start, end: safeEnd }).pipe(res);
  console.log({ range, fileSize });
});