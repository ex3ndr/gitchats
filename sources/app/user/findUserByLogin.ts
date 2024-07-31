import { Tx } from "@/modules/storage/inTx";

export async function findUserByLogin(tx: Tx, login: string) {
    return await tx.user.findFirst({ where: { login: login, deletedAt: null } });
}