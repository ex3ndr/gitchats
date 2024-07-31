import fastify from "fastify";
import { log, logger } from "../../utils/log";
import { hasRole } from "../../roles";
import { auth, authDecorators, tokenAuthPlugin } from "./routes/auth";
import { pre } from "./routes/pre";
import { secure } from './routes/secure';

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

        // Special case for account operations that don't require a valid user
        app.register(async function (sub) {
            sub.addHook('preHandler', tokenAuthPlugin('any')); // Doesn't require any user, login or token
            secure(sub);
        }, { prefix: '/secure' });
    }

    // Start
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen({ port, host: '0.0.0.0' });
}