import { nodewhisper } from "nodejs-whisper";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { table } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioBase = path.resolve(__dirname, "../");

const trackSeeder = path.resolve(__dirname, "../seeders/20260430083028-demo-tracks.cjs");
const { default: { tracks } } = await import(pathToFileURL(trackSeeder).href);

const formatTimeStamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2).padStart(5, "0");
    return `[${String(minutes).padStart(2, "0")}:${secs}]`
};

const transcribeTrack = async (track) => {
    const fullAudio = path.join(audioBase, track.audioPath);
    const result = await nodewhisper(fullAudio, {
        modelName: "medium",
        autoDownloadModelName: "medium",
        whisperOptions: {
            outputInJson: true,
            language: "auto",
            wordTimestamps: false,
        }
    });

    const lines = result.segments.map((seg) => `${formatTimeStamp(seg.start)}${seg.text.trim()}`);

    return {
        trackId: track.id,
        language: result.language === "ja" ? "Japanese" : result.language,
        text: `\n          ${lines.join("\n          ")}\n`
    }
};

const main = async () => {
    const results = [];
    for (const track of tracks) {
      try {
        const entry = await transcribeTrack(track);
        results.push(entry);
      } catch (err) {
        console.warn(`Failed to transcribe ${track.title}`, err.message);
      }
    }

    const seederCode = `
    "use strict";
    /** @type {import("sequelize-cli").Seeder} */
        module.exports = {
        async up(queryInterface, Sequelize) {
              const now = new Date();
              const yesterday = new Date(now);
              yesterday.setDate(now.getDate() - 1);

              const entries = ${JSON.stringify(results, null, 2)};

              await queryInterface.bulkInsert(
              "Lyrics",
              entries.map((entry) => ({
                  ...entry,
                  createdAt: yesterday,
                  updatedAt: now,
              })),
              {}
              );
          },

          async down(queryInterface, Sequelize) {
              await queryInterface.bulkDelete("Lyrics", null, {});
          },
        };
    `;

    fs.writeFileSync(
      path.join(__dirname, "../seeders/20260501200612-demo-lyrics.cjs"),
      seederCode
    );

};

main();