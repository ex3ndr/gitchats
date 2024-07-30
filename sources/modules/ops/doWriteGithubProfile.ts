import { Tx } from "@/modules/storage/inTx";
import { GithubApiProfile } from "@/modules/github/api";

export async function doWriteGithubProfile(tx: Tx, profile: GithubApiProfile) {
    await tx.githubProfile.upsert({
        where: { id: profile.id },
        update: {
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
        },
        create: {
            id: profile.id,
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
        }
    });
}