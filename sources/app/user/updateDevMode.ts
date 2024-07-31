import { Tx } from "@/modules/storage/inTx";

export async function updateDevMode(tx: Tx, uid: string, devmode: boolean) {
    await tx.user.update({
        where: { id: uid },
        data: { developer: devmode }
    });
}