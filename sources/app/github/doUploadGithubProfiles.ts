import { GithubApiProfile } from "@/modules/github/api";
import { db } from "@/modules/storage/db";
import { doCacheImage } from "../../modules/files/doCacheImage";

export async function doUploadGithubProfiles(profile: GithubApiProfile) {

    //
    // Upload avatar
    //

    const avatar = await doCacheImage('avatar', profile.avatar);

    //
    // Update profile
    //

    await db.githubProfile.upsert({
        where: { id: profile.id },
        update: {
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
            photo: avatar
        },
        create: {
            id: profile.id,
            username: profile.username,
            firstName: profile.firstName,
            lastName: profile.lastName,
            photo: avatar
        }
    });
}