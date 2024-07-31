import { Tx } from "@/modules/storage/inTx";
import { resolveFileLink } from "@/modules/files/files";

export async function getUserProfilePublic(tx: Tx, uid: string, visibleBy: string) {
    let user = await tx.user.findFirst({
        where: { id: uid, deletedAt: null }
    });
    let username: string = 'deleted';
    let firstName: string | null = 'Deleted';
    let lastName: string | null = 'Account';
    let photo: { url: string, width: number, height: number, thumbhash: string } | null = null;
    let bot = false;
    let system = false;
    let github: string | null = null;
    if (user) {
        firstName = user.firstName;
        lastName = user.lastName;
        username = user.username;
        bot = user.bot;
        system = user.system;
        if (user.photo) {
            photo = {
                url: resolveFileLink('public/avatar/' + (user.photo as any).id),
                width: (user.photo as any).width,
                height: (user.photo as any).height,
                thumbhash: (user.photo as any).thumbhash
            };
        }
        github = 'https://github.com/' + username;
    }
    return {
        id: uid,
        firstName,
        lastName,
        username,
        photo,
        exist: !!user,
        bot,
        system,
        github
    };
}