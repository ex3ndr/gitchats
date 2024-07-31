import { FastifyInstance } from "fastify";
import * as z from 'zod';
import { inTx } from "@/modules/storage/inTx";
import { authUser } from "./auth";
import { registerPushToken } from "@/modules/push/registerPushToken";
import { updateDevMode } from "@/app/user/updateDevMode";
import { getUserProfilePrivate } from "@/app/user/getUserProfilePrivate";
import { getUserProfilePublic } from "@/app/user/getUserProfilePublic";

export async function profile(app: FastifyInstance) {
    app.post('/me', async (request, reply) => {
        let res = await inTx(async (tx) => {
            return await getUserProfilePrivate(tx, authUser(request));
        });
        return {
            ok: true,
            profile: res
        };
    });

    const devmodeRequest = z.object({ enable: z.boolean() }).strict();
    app.post('/profile/edit/developer', async (request, reply) => {
        // Check if the request is valid
        const body = devmodeRequest.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        let uid = authUser(request);

        // Update the devmode
        await inTx(async (tx) => {
            await updateDevMode(tx, uid, body.data.enable);
        });

        return {
            ok: true
        };
    });

    const usersRequest = z.object({ ids: z.string().array() }).strict();
    app.post('/users', async (request, reply) => {

        // Check if the request is valid
        const body = usersRequest.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        let uid = authUser(request);

        // Load the profiles
        let res = await inTx(async (tx) => {
            return await Promise.all(body.data.ids.map(async (id) => {
                return await getUserProfilePublic(tx, id, uid);
            }));
        });

        return {
            ok: true,
            users: res
        };
    });

    const registerPushTokenRequest = z.object({
        token: z.string()
    }).strict();
    app.post('/register_push_token', async (request, reply) => {
        const body = registerPushTokenRequest.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        let uid = authUser(request);
        await registerPushToken(uid, body.data.token);
        return { ok: true };
    });
}