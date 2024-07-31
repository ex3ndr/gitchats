import fastify from "fastify";
import { log, logger } from "../../utils/log";
import { hasRole } from "../../roles";
import { auth, authDecorators, tokenAuthPlugin } from "./routes/auth";
import { pre } from "./routes/pre";

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
    authDecorators(app as any);

    // Entry
    app.get('/', function (request, reply) {
        reply.send('Welcome to Gitchats API!');
    });

    // API routes
    if (hasRole('api')) {

        // Auth routes
        app.register(auth, { prefix: '/auth' });

        // Onboarding routes
        app.register(async (sub) => {
            sub.addHook('preHandler', tokenAuthPlugin('login')); // Requires login associated with token
            pre(sub);
        }, { prefix: '/pre' });
    }

    // Start
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen({ port, host: '0.0.0.0' });
}