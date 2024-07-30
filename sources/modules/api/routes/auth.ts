import { FastifyInstance } from "fastify";
import * as z from "zod";
import { startAuth } from "@/modules/github/authStart";
import { authVerify } from "@/modules/github/authVerify";

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
        let config = await startAuth(body.data.platform);
        return { ok: true, ...config };
    });
    const authVerifySchema = z.object({
        code: z.string()
    }).strict();
    app.post('/verify', async (request, reply) => {
        const body = authVerifySchema.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        const token = await authVerify(body.data.code);
        return { ok: true, token };
    });
}
