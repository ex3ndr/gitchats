import { exchangeCodeForToken } from "../github/githubAuth";
import { getUserProfile } from "../github/api";
import { inTx } from "../storage/inTx";
import { generateSafeToken } from "../crypto/generateSafeToken";
import { doUploadGithubProfiles } from "../ops/doUploadGithubProfiles";

export async function authVerify(code: string) {

    // Exchange code for token
    const githubToken = await exchangeCodeForToken(code);

    // Create token
    const token = await generateSafeToken();

    // Load profile
    const profile = await getUserProfile(githubToken);
    await doUploadGithubProfiles(profile);

    // Create session
    const login = 'github:' + profile.id;
    await inTx(async (tx) => {

        // Check if token exists (should not happen)
        let ex = await tx.sessionToken.findUnique({ where: { key: token } });
        if (ex) {
            return;
        }

        // Try to find user
        let user = await tx.user.findFirst({ where: { login: login, deletedAt: null } });

        // Create token
        await tx.sessionToken.create({
            data: {
                key: token,
                keyGithub: token,
                login: login,
                userId: user ? user.id : null
            }
        });
    });

    return token;
}