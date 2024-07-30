import { splitName } from "@/utils/splitName";
import { getGitHubUserClient } from "./githubAuth";

export type GithubApiProfile = {
    id: string;
    username: string;
    firstName: string;
    lastName: string | null;
    bio: string | null;
}

export async function getUserProfile(token: string) {
    const client = getGitHubUserClient(token);

    // Load user
    const user = await client.request('GET /user');
    const avatarUrl = user.data.avatar_url;
    const { first, last } = splitName(user.data.name || 'Noname');
    const bio = user.data.bio;
    const username = user.data.login;

    // Convert to GithubProfile
    const profile: GithubApiProfile = {
        id: user.data.id.toString(),
        username: username,
        firstName: first,
        lastName: last,
        bio: bio
    };

    return profile;
}