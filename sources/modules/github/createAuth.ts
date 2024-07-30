import { createAppAuth } from "@octokit/auth-app";
import { auth } from "./auth";

export async function createAuth() {
    const request = await auth({ type: 'app' });
    return request;
}