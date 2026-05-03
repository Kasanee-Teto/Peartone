const ffmpeg = require("fluent-ffmpeg");

function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(Math.round(metadata.format.duration)); 
    });
  });
}

module.exports = getAudioDuration;