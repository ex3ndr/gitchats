import { randomKey } from "@/utils/randomKey";
import { uploadFile } from "@/modules/files/files";
import { processImage } from "@/modules/media/processImage";
import { inTx } from "@/modules/storage/inTx";
import axios from 'axios';

export async function doCacheImage(kind: 'avatar', url: string): Promise<{ id: string, width: number, height: number, thumbhash: string }> {

    // Check existing
    let existing = await inTx(async (tx) => {
        let existing = await tx.simpleCache.findUnique({ where: { key: 'image:' + kind + ':' + url.toLocaleLowerCase() } });
        if (existing) {
            return JSON.parse(existing.value) as { id: string, width: number, height: number, thumbhash: string };
        } else {
            return null;
        }
    });

    // Skip if already cached
    if (existing) {
        return existing;
    }

    // Download image
    let image = await axios.get(url, { responseType: 'arraybuffer', maxBodyLength: 1024 * 1024 * 10 });
    let raw = Buffer.from(image.data);

    // Preprocess image
    let processed = await processImage(raw);

    // Upload image
    let id = randomKey('av', 32);
    await uploadFile('public/' + kind + '/' + id + '.jpg', processed.compressed);

    // Save image reference
    return await inTx(async (tx) => {
        let existing = await tx.simpleCache.findUnique({ where: { key: 'image:' + kind + ':' + url.toLocaleLowerCase() } });
        if (existing) {
            return JSON.parse(existing.value) as { id: string, width: number, height: number, thumbhash: string };
        }
        await tx.simpleCache.create({
            data: {
                key: 'image:' + kind + ':' + url.toLocaleLowerCase(),
                value: JSON.stringify({ id, width: processed.width, height: processed.height, thumbhash: processed.thumbhash })
            }
        });
        return { id, width: processed.width, height: processed.height, thumbhash: processed.thumbhash };
    });
}