// media.utils.js
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import mime from 'mime-types';
import fs from 'fs';

 
export async function compressMedia(inputPath, outputPath, options = {}) {
    const mimeType = mime.lookup(inputPath) || '';
    const ext = path.extname(inputPath).toLowerCase();

    if (mimeType.startsWith('image') || ['.jpg', '.jpeg', '.png', '.webp', '.tiff'].includes(ext)) {
        return compressImage(inputPath, outputPath, options);
    } 
    else if (mimeType.startsWith('video') || ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
        return compressVideo(inputPath, outputPath, options);
    } 
    else {
        throw new Error(`Unsupported file type: ${ext}`);
    }
}
 
async function compressImage(inputPath, outputPath, options = {}) {
    const { width = null, height = null, quality = 80 } = options;

    try {
        await sharp(inputPath)
            .resize(width, height, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality, mozjpeg: true })
            .toFile(outputPath);

        console.log(`Image compressed & saved: ${outputPath}`);

    } catch (err) {
        console.error(`Image compression failed:`, err);
        throw err;
    }
}
 
function compressVideo(inputPath, outputPath, options = {}) {
    
    const { crf = 28, preset = 'medium', resolution = null } = options; 

    return new Promise((resolve, reject) => {
        let command = ffmpeg(inputPath)
            .outputOptions([
                `-vcodec libx264`,
                `-crf ${crf}`,
                `-preset ${preset}`,
                `-movflags +faststart`
            ]);

        if (resolution) {
            command = command.size(resolution);  
        }

        command
            .save(outputPath)
            .on('end', () => {
                console.log(`Video compressed & saved: ${outputPath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Video compression failed:`, err);
                reject(err);
            });
    });
}

/*

import { compressMedia } from './media.utils.js';

await compressMedia(
    './uploads/original/sample.jpg',
    './uploads/optimized/sample_optimized.jpg',
    { width: 1200, quality: 75 }
);

await compressMedia(
    './uploads/original/video.mp4',
    './uploads/optimized/video_optimized.mp4',
    { crf: 28, preset: 'slow', resolution: '1280x720' }
);


*/