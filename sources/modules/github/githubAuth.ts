import { createAppAuth, createOAuthUserAuth } from "@octokit/auth-app";
import { Octokit } from "octokit";

//
// App auth object
//

const githubAuth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
});

//
// Exchange code for token
//

export async function exchangeCodeForToken(src: string) {
    const { token } = await githubAuth({ type: "oauth-user", code: src });
    return token;
}

//
// Create clients
//

export function getGitHubAppClient() {
    return new Octokit({
        authStrategy: createAppAuth,
        auth: {
            appId: process.env.GITHUB_APP_ID!,
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
        }
    });
}

export function getGitHubUserClient(token: string) {
    return new Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
            token
        }
    });
}

// export const userAuth = createAppAuth({
//     appId: process.env.GITHUB_APP_ID!,
//     privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
// });

// export const appOctokit = new Octokit({
//     authStrategy: createAppAuth,
//     auth: {
//         appId: process.env.GITHUB_APP_ID!,
//         clientId: process.env.GITHUB_CLIENT_ID!,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//         privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY!, 'base64').toString('utf-8'),
//     },
// });