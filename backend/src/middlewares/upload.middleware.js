import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import ApiError from "../utils/apiError.js";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const audioDir = path.resolve("storage/audio");
const coverDir = path.resolve("storage/covers");
const artistDir = path.resolve("storage/artists");

ensureDir(audioDir);
ensureDir(coverDir);
ensureDir(artistDir);

const AUDIO_TYPES = {
  "audio/mpeg": ".mp3",
  "audio/wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/flac": ".flac"
};

const IMAGE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") return cb(null, audioDir);
    if (file.fieldname === "cover") return cb(null, coverDir);
    if (file.fieldname === "image") return cb(null, artistDir);
    return cb(new Error("FIELD_NOT_ALLOWED"));
  },
  filename: (req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const timestamp = Date.now();

    let ext;
    if (file.fieldname === "audio") {
      ext = AUDIO_TYPES[file.mimetype];
    } else {
      ext = IMAGE_TYPES[file.mimetype];
    }

    if (!ext) {
      return cb(new Error("INVALID_MIMETYPE"));
    }

    cb(null, `${file.fieldname}-${timestamp}-${uniqueId}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio") {
    if (!AUDIO_TYPES[file.mimetype]) {
      return cb(new Error("INVALID_AUDIO_FORMAT"));
    }
  } else if (["cover", "image"].includes(file.fieldname)) {
    if (!IMAGE_TYPES[file.mimetype]) {
      return cb(new Error("INVALID_IMAGE_FORMAT"));
    }
  } else {
    return cb(new Error("FIELD_NOT_ALLOWED"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});


const ERROR_MESSAGES = {
  FIELD_NOT_ALLOWED: "Unexpected field in upload request.",
  INVALID_AUDIO_FORMAT: "Invalid audio format. Allowed: MP3, WAV, OGG, FLAC.",
  INVALID_IMAGE_FORMAT: "Invalid image format. Allowed: JPEG, PNG, WEBP.",
  INVALID_MIMETYPE: "Could not determine a safe file extension for the uploaded file."
};


const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (!err) return next();

      let message;

      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            message = "File too large. Maximum size is 50 MB.";
            break;
          case "LIMIT_FILE_COUNT":
            message = "Too many files uploaded.";
            break;
          case "LIMIT_UNEXPECTED_FILE":
            message = `Unexpected field: ${err.field}`;
            break;
          default:
            message = `Upload error: ${err.message}`;
        }
      } else if (err instanceof Error) {
        message = ERROR_MESSAGES[err.message] || err.message || "Upload failed.";
      } else {
        message = "An unknown error occurred during upload.";
      }

      return next(new ApiError(400, message));
    });
  };
};

export const uploadTrackFiles = handleMulterError(
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ])
);

export const uploadArtistImage = handleMulterError(upload.single("image"));