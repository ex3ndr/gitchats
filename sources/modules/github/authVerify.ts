import { exchangeCodeForToken } from "./githubAuth";
import { getUserProfile } from "./api";
import { inTx } from "../storage/inTx";
import { doWriteGithubProfile } from "../ops/doWriteGithubProfile";
import { generateSafeToken } from "../crypto/generateSafeToken";

export async function authVerify(code: string) {

    // Exchange code for token
    const githubToken = await exchangeCodeForToken(code);

    // Create token
    const token = await generateSafeToken();

    // Load user
    const profile = await getUserProfile(githubToken);
    const login = 'github:' + profile.id;
    await inTx(async (tx) => {

        // Write github profile
        await doWriteGithubProfile(tx, profile);

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