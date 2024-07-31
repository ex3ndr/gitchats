import { Tx } from "@/modules/storage/inTx";
import { resolveFileLink } from "@/modules/files/files";

export async function getUserProfilePrivate(tx: Tx, uid: string) {
    let user = await tx.user.findFirst({
        where: { id: uid, deletedAt: null }
    });
    let username: string = 'deleted';
    let firstName: string = 'Deleted';
    let lastName: string | null = 'Account';
    let photo: { url: string, width: number, height: number, thumbhash: string } | null = null;
    let roles: string[] = [];
    let github: string | null = null;
    if (user) {
        username = user.username;
        firstName = user.firstName;
        lastName = user.lastName;

        if (user.experimental) {
            roles.push('experimental');
        }
        if (user.developer) {
            roles.push('developer');
        }
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
        username,
        firstName,
        lastName,
        roles
    };
}