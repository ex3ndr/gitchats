import { auth } from "./auth";

export async function authVerify(code: string) {

    // Exchange code for token
    const token = (await auth({ type: "oauth-user", code })).token;

    // Get user info
    // const user = await octokit.request("GET /user", {
    //     headers: {
    //         "X-GitHub-Api-Version": "2022-11-28",
    //     },
    // });
    console.warn(token);

    return '!!!';
}