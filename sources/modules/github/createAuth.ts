import { createAppAuth } from "@octokit/auth-app";
import { createGithubAuth } from "./createGithubAuth";

export async function createAuth() {
    const request = await createGithubAuth()({ type: 'app' });
    return request;
}