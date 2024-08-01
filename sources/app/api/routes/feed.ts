import { FastifyInstance } from "fastify";
import * as z from 'zod';
import { authUser } from "./auth";
import { getFeedSeqno, feedList } from "../../feed/actions";
import { FeedSource } from "../../feed/types";
import { inTx } from "@/modules/storage/inTx";
import { FeedItem } from "@prisma/client";

function feedItemToAPI(item: FeedItem) {
    return {
        seq: item.seq,
        content: item.content,
        date: item.createdAt.getTime(),
        by: item.byId,
    };
}

export async function feed(app: FastifyInstance) {

    // Get Feed State
    const feedGet = z.object({ source: z.string() });
    app.post('/feed/state', async (request, reply) => {
        const body = feedGet.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        let source: FeedSource<any> = FeedSource.fromPublicId(body.data.source);
        let uid = authUser(request);
        let seqno = await inTx(async (tx) => {
            return await getFeedSeqno(tx, uid, source);
        });
        return {
            ok: true,
            seqno
        };
    });

    // Get Feed Items
    const feedListReq = z.object({
        source: z.string(),
        after: z.number().optional().nullable(),
        before: z.number().optional().nullable(),
    });
    app.post('/feed/list', async (request, reply) => {
        const body = feedListReq.safeParse(request.body);
        if (!body.success) {
            reply.code(400);
            return { ok: false, error: 'invalid_request' };
        }
        let uid = authUser(request);
        let source: FeedSource<any> = FeedSource.fromPublicId(body.data.source);
        let res = await feedList(uid, source, body.data.before ? body.data.before : null, body.data.after ? body.data.after : null);
        return {
            ok: true,
            items: res.items.map((v) => feedItemToAPI(v)),
            next: res.next
        };
    });
}