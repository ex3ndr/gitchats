import { exchangeCodeForToken } from "@/modules/github/githubAuth";
import { getUserProfile } from "@/modules/github/api";
import { inTx } from "@/modules/storage/inTx";
import { generateSafeToken } from "@/modules/crypto/generateSafeToken";
import { doUploadGithubProfiles } from "../github/doUploadGithubProfiles";

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
                keyGithub: githubToken,
                login: login,
                userId: user ? user.id : null
            }
        });
    });

    return token;
}