import { inTx } from "@/modules/storage/inTx";
import { findUserByLogin } from "../user/findUserByLogin";

export type PreStateResponse = {
    active: boolean,
    canActivate: boolean,
}

export async function resolvePreState(login: string): Promise<PreStateResponse> {
    return await inTx<PreStateResponse>(async (tx) => {
        let canActivate = false;
        let active = false;

        // Check if profile exists
        let user = await findUserByLogin(tx, login);
        if (user) {
            active = true;
        }

        // If profile completed and username is set, then canActivate
        canActivate = !active;

        // Return result
        return { active, canActivate };
    });
}


// export async function saveUsername(login: string, username: string): Promise<'ok' | 'invalid_username' | 'already_used'> {
//     return await inTx<'ok' | 'invalid_username' | 'already_used'>(async (tx) => {

//         // Ignore if user (with username) already exists
//         let user = await findUserByLogin(tx, login);
//         if (user) {
//             return 'ok';
//         }

//         // Ignore if onboarding state already exists and has username
//         let onboardingState = await tx.onboardingState.findUnique({ where: { login } });
//         if (onboardingState && onboardingState.username !== null) {
//             return 'ok';
//         }

//         // Check username format
//         if (!checkUsername(username)) {
//             return 'invalid_username';
//         }

//         // Check if username is already used by user
//         let usernameExists = await getUserByUsername(tx, username);
//         if (usernameExists) {
//             return 'already_used';
//         }

//         // Check if username is already used by onboarding state
//         onboardingState = await tx.onboardingState.findFirst({
//             where: {
//                 username: {
//                     equals: username,
//                     mode: 'insensitive'
//                 }
//             }
//         });
//         if (onboardingState) {
//             return 'already_used';
//         }

//         // Save username
//         await tx.onboardingState.upsert({
//             where: { login },
//             create: { login, username },
//             update: { username }
//         });

//         return 'ok';
//     });
// }

// export async function saveName(login: string, firstName: string, lastName: string | null): Promise<'ok' | 'invalid_name'> {
//     return await inTx<'ok' | 'invalid_name'>(async (tx) => {

//         // Ignore if user already exists
//         let user = await findUserByLogin(tx, login);
//         if (user) {
//             return 'ok';
//         }

//         // Check name format
//         if (firstName.length === 0 || firstName.length > 50) {
//             return 'invalid_name';
//         }
//         if (lastName !== null && (lastName.length === 0 || lastName.length > 50)) {
//             return 'invalid_name';
//         }

//         // Save name
//         await tx.onboardingState.upsert({
//             where: { login },
//             create: { login, firstName, lastName },
//             update: { firstName, lastName }
//         });

//         return 'ok';
//     });
// }

export async function completeProfile(login: string): Promise<'ok' | 'invalid_state'> {
    return await inTx<'ok' | 'invalid_state'>(async (tx) => {

        // Ignore if user already exists
        let user = await findUserByLogin(tx, login);
        if (user) {
            return 'ok';
        }

        // We only support GitHub login
        if (!login.startsWith('github:')) {
            return 'invalid_state';
        }

        // Load GitHub profile
        let githubId = login.substring(7);
        let githubProfile = await tx.githubProfile.findUniqueOrThrow({ where: { id: githubId } });

        // Create user
        const u = await tx.user.create({
            data: {
                login,
                username: githubProfile.username,
                firstName: githubProfile.firstName,
                lastName: githubProfile.lastName,
                photo: githubProfile.photo as any, /* WTF? */
                deletedAt: null
            }
        });

        // Update tokens
        await tx.sessionToken.updateMany({
            where: { login },
            data: { userId: u.id }
        });

        // Delete onboarding state (if exists)
        // await tx.onboardingState.delete({ where: { login } });

        return 'ok';
    });
}