import sharp from "sharp";
import { thumbhash } from "./thumbhash";

export async function processImage(src: Buffer) {

    // Read image
    let meta = await sharp(src).metadata();
    let width = meta.width!;
    let height = meta.height!;

    // Resize
    let targetWidth = 100;
    let targetHeight = 100;
    if (width > height) {
        targetHeight = Math.round(height * targetWidth / width);
    } else if (height > width) {
        targetWidth = Math.round(width * targetHeight / height);
    }

    // Resize image
    const { data, info } = await sharp(src).resize(targetWidth, targetHeight).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    // Thumbhash
    const binaryThumbHash = thumbhash(info.width, info.height, data);
    const thumbhashStr = Buffer.from(binaryThumbHash).toString('base64');

    // Recompress
    const compressed = await sharp(src).jpeg({ quality: 80 }).toBuffer();

    return {
        compressed: compressed,
        width: width,
        height: height,
        thumbhash: thumbhashStr
    };
}