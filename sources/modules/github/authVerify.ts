import { splitName } from "@/utils/splitName";
import { exchangeCodeForToken, getGitHubUserClient } from "./githubAuth";

export async function authVerify(code: string) {

    // Exchange code for token
    const token = await exchangeCodeForToken(code);

    // Fetch profile
    const client = getGitHubUserClient(token);

    // Load user
    const user = await client.request('GET /user');
    const avatarUrl = user.data.avatar_url;
    const { first, last } = splitName(user.data.name || 'Noname');
    const bio = user.data.bio;

    console.warn(user.data.avatar_url);

    // Get user info
    // const user = await octokit.request("GET /user", {
    //     headers: {
    //         "X-GitHub-Api-Version": "2022-11-28",
    //     },
    // });
    console.warn(token);

    return '!!!';
}