import { getGitHubUserClient } from "./githubAuth";

export async function getUserProfile(token: string) {
    const client = getGitHubUserClient(token);

    // Load user
    const user = await client.request('GET /user');

    return user;
}