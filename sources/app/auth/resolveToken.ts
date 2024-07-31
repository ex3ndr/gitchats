import { inTx } from "@/modules/storage/inTx";

export type ResolveTokenResult = { user?: string, deleted?: boolean, sessionId: string, login: string } | null;
export async function resolveToken(token: string): Promise<ResolveTokenResult> {
    return await inTx(async (tx) => {
        let session = await tx.sessionToken.findUnique({ where: { key: token } });
        if (!session) {
            return null;
        }
        if (session.userId) {
            let user = await tx.user.findUnique({ where: { id: session.userId } });
            let deleted = !user || user.deletedAt !== null;
            return { login: session.login, sessionId: session.id, user: session.userId, deleted };
        } else {
            return { login: session.login, sessionId: session.id, };
        }
    });
}