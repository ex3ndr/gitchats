import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as z from "zod";
import { authVerify } from "@/modules/auth/authVerify";
import { startAuth } from "@/modules/auth/authStart";
import { resolveToken } from "@/modules/auth/resolveToken";

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

export function authDecorators(app: FastifyInstance) {
    app.decorateRequest('setAuth', function (login: string, user: string | null, deleted: boolean | null) {
        (this as any).auth = { login, user, deleted };
    });
    app.decorateRequest('setAuthNone', function () {
        (this as any).auth = null;
    });
}

//
// Token authentication
//

export function tokenAuthPlugin(mode: 'login' | 'user' | 'any') {
    return async function (request: FastifyRequest, reply: FastifyReply) {

        // Check for token
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            if (mode !== 'any') {
                reply.status(401).send({ error: 'Unauthorized' });
            }
            (request as any).setAuthNone();
            return;
        }

        // Load token
        const token = authHeader.split(' ')[1];
        let resolved = await resolveToken(token);
        if (!resolved) {
            if (mode !== 'any') {
                reply.status(401).send({ error: 'Invalid token' });
            }
            (request as any).setAuthNone();
            return;
        }
        if (mode === 'user' && (!resolved.user || resolved.deleted)) {
            reply.status(401).send({ error: 'User not found' });
            return;
        }

        // Store auth data
        (request as any).setAuth(resolved.login, resolved.user ? resolved.user : null, resolved.deleted ? resolved.deleted : false);
    };
}

//
// Authentication context helpers
//

export function authUser(request: FastifyRequest) {
    if (!(request as any).auth.user || (request as any).auth.deleted) {
        throw new Error('No user in request');
    }
    return (request as any).auth.user as string;
}

export function authUserAllowDeleted(request: FastifyRequest) {
    if (!(request as any).auth.user) {
        throw new Error('No user in request');
    }
    return (request as any).auth.user as string;
}

export function authLogin(request: FastifyRequest) {
    return (request as any).auth.login as string;
}

export function authRaw(request: FastifyRequest) {
    return (request as any).auth as { login: string, user: string | null, deleted: boolean | null } | null;
}