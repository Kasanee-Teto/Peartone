import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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

const ALLOWED_AUDIO = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"];
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") return cb(null, audioDir);
    if (file.fieldname === "cover") return cb(null, coverDir);
    if (file.fieldname === "image") return cb(null, artistDir);
    return cb(new Error("FIELD_NOT_ALLOWED"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio") {
    if (!ALLOWED_AUDIO.includes(file.mimetype)) {
      return cb(new Error("Invalid audio format. Use MP3, WAV, OGG, or FLAC."));
    }
  } else if (["cover", "image"].includes(file.fieldname)) {
    if (!ALLOWED_IMAGES.includes(file.mimetype)) {
      return cb(new Error("Invalid image format. Use JPEG, PNG, or WEBP."));
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

const handleMulterError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ status: 400, message: `Upload error: ${err.message}` });
      } else if (err) {
        const message = err.message || "An unknown error occurred during upload.";
        return res.status(400).json({ status: 400, message });
      }
      next();
    });
  };
};

export const uploadTrackFiles = handleMulterError(
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ])
);

export const uploadArtistImage = handleMulterError(
  upload.single("image")
);