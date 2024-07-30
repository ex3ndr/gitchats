import { FastifyInstance } from "fastify";
import * as z from "zod";
import { startAuth } from "../../github/authStart";

export async function auth(app: FastifyInstance) {
    const authStartSchema = z.object({
        platform: z.union([z.literal("ios"), z.literal("android"), z.literal("web")]),
    }).strict();
    app.post('/start', async (request, reply) => {
        const body = authStartSchema.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        return await startAuth(body.data.platform);
    });
    // app.post('/verify', async (request, reply) => {
    //     return await createAuth();
    // });
}
