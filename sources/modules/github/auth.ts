import { createAppAuth } from "@octokit/auth-app";

export const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
});