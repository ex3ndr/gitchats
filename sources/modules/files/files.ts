import * as Minio from 'minio';

export const s3client = new Minio.Client({
    endPoint: process.env.S3_HOST!,
    useSSL: true,
    accessKey: process.env.S3_ACCESS_KEY!,
    secretKey: process.env.S3_SECRET_KEY!,
});

export const s3bucket = process.env.S3_BUCKET!;

export async function loadFiles() {
    await s3client.bucketExists(s3bucket); // Throws if bucket does not exist or is not accessible
}

export async function uploadFile(path: string, data: Buffer) {
    await s3client.putObject(s3bucket, path, data);
}

export function resolveFileLink(path: string) {
    return `https://${process.env.S3_HOST}/${s3bucket}/${path}`;
}