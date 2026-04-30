import multer from "multer";
import path from "path";
import fs from "fs";

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") return cb(null, audioDir);
    if (file.fieldname === "cover") return cb(null, coverDir);
    if (file.fieldname === "image") return cb(null, artistDir);
    return cb(new Error("Invalid upload field"));
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname);
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "audio" && !file.mimetype.startsWith("audio/")) {
    return cb(new Error("Audio file required"));
  }
  if (file.fieldname === "cover" && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Image file required"));
  }
  if (file.fieldname === "image" && !file.mimetype.startsWith("image/")) {
    return cb(new Error("Image file required"));
  }
  return cb(null, true);
};

export const uploadTrackFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
}).fields([
  { name: "audio", maxCount: 1 },
  { name: "cover", maxCount: 1 }
]);

export const uploadArtistImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
}).single("image");