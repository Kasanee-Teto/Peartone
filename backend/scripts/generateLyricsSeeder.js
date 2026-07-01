import { pipeline, env } from "@huggingface/transformers";
import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { execSync } from "child_process";
import * as wanakana from "wanakana";
import kuromoji from "kuromoji";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audioBase = path.resolve(__dirname, "../");

env.allowLocalModels = false;

const initTokenizer = () => {
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, tokenizer) => {
            if (err) reject(err);
            else resolve(tokenizer);
        });
    });
};

const tokenizer = await initTokenizer();

console.log("Initializing Whisper pipeline and downloading model weights...");

const transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-small", {
    progress_callback: (progress) => {
        if (progress.status === "progress") {
            const percentage = progress.progress.toFixed(1);
            const loadedMB = (progress.loaded / 1024 / 1024).toFixed(1);
            const totalMB = (progress.total / 1024 / 1024).toFixed(1);

            process.stdout.write(
                `\r[Downloading] ${progress.file}: ${percentage}% (${loadedMB}MB / ${totalMB}MB)`
            );
        } else if (progress.status === "ready") {
            process.stdout.write(`\r[Ready] Loaded file: ${progress.file}\n`);
        }
    }
});

console.log("\nModel ready! Moving to track extraction...");

const trackSeeder = path.resolve(__dirname, "../seeders/20260430083028-demo-tracks.cjs");
const { default: { tracks } } = await import(pathToFileURL(trackSeeder).href);

const formatTimeStamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2).padStart(5, "0");
    return `[${String(minutes).padStart(2, "0")}:${secs}]`
};

const cleanTextToRomaji = (text) => {
    const tokens = tokenizer.tokenize(text);
    
    const pureKanaLine = tokens.map(token => {
        if (token.reading) {
            return wanakana.toHiragana(token.reading);
        }
        return token.surface_form;
    }).join("");

    return wanakana.toRomaji(pureKanaLine);
};

const getAudioBuffer = (audioPath) => {
    const tempWav = audioPath.replace(/\.[^/.]+$/, "") + "_temp.wav";
    execSync(`ffmpeg -y -i "${audioPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${tempWav}"`, { stdio: "inherit" });
    
    const buffer = fs.readFileSync(tempWav);
    fs.unlinkSync(tempWav); 
    
    const pcmData = new Int16Array(buffer.buffer, buffer.byteOffset + 44, (buffer.byteLength - 44) / 2);
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        float32Data[i] = pcmData[i] / 32768.0;
    }
    return float32Data;
};

const transcribeTrack = async (track) => {
    const fullAudio = path.join(audioBase, track.audioPath);
    try {
        const audioData = getAudioBuffer(fullAudio);
        const result = await transcriber(audioData, {
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
            language: "japanese",
            task: "transcribe",
        });

        const lines = result.chunks.map((chunk) => {
            const start = chunk.timestamp[0] || 0;
            const nativeText = chunk.text.trim();
            const romajiText = cleanTextToRomaji(nativeText);
            
            return `${formatTimeStamp(start)}${romajiText}`;
        });

        return {
            trackId: track.id,
            language: "Japanese (Romaji)",
            text: `\n          ${lines.join("\n          ")}\n`
        };
    } catch (err) {
        throw new Error(`Transcription failure: ${err.message}`);
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