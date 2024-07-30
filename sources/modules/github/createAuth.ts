import { createAppAuth } from "@octokit/auth-app";

export async function createAuth() {
    const auth = createAppAuth({
        appId: process.env.GITHUB_APP_ID!,
        clientId: process.env.GITHUB_CLIENT_ID!,
        privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
    });
    const request = await auth({ type: 'app' });
    return request;
}