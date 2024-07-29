import fastify from "fastify";
import { log, logger } from "../../utils/log";
import { hasRole } from "../../roles";

export async function startApi() {

    // Configure
    log('Starting API...');

    // Start API
    const app = fastify({
        logger: (hasRole('api') || hasRole('public-api')) ? logger : false,
        trustProxy: true,
        bodyLimit: 1024 * 1024 * 100, // 100MB
    });
    app.register(require('@fastify/cors'), {
        origin: '*',
        allowedHeaders: '*',
        methods: ['GET', 'POST']
    });
    // app.decorateRequest('setAuth', function (login: string, id: string, user: string | null, deleted: boolean | null) {
    //     (this as any).auth = { login, user, id, deleted };
    // });
    // app.decorateRequest('setAuthNone', function () {
    //     (this as any).auth = null;
    // });
    app.get('/', function (request, reply) {
        reply.send('Welcome to Gitchats API!');
    });

    // Start
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen({ port, host: '0.0.0.0' });
}