import crypto from 'crypto';

export function createSalt(usage: string | Buffer) {
    return crypto.createHmac('sha512', Buffer.from(process.env.ENCRYPTION_SALT!))
        .update(Buffer.from(usage))
        .digest();
}