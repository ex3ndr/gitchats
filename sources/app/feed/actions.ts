import { Tx, inTx } from "@/modules/storage/inTx";
import { pushUpdate } from "../updates/updates";
import { Content, contentCodecs, ContentKind } from "./content";
import { FeedSource } from "./types";

//
// Posting
//

export async function feedPost<T extends ContentKind>(tx: Tx, args: { uid: string, by: string, content: Content<T>, feed: FeedSource<T> }) {

    // Validate content (how to do this better?)
    contentCodecs[args.feed.content].parse(args.content);

    // Resolve seqno
    let { seq, id } = await getNextFeedSeqnoAndId(tx, args.uid, args.feed.tag);

    // Push to feed
    const item = await tx.feedItem.create({
        data: {
            fid: id,
            seq: seq,
            byId: args.by,
            content: args.content
        }
    });

    // Push update to user
    await pushUpdate(tx, args.uid, {
        type: 'feed-posted',
        source: args.feed.publicId,
        seq: seq,
        date: item.createdAt.getTime(),
        by: args.by,
        content: args.content,
        repeatKey: null
    });
}

//
// List
//

export async function feedList(uid: string, source: FeedSource<any>, before: number | null, after: number | null) {
    return await inTx(async (tx) => {

        // Get Feed ID
        let id = await getFeedId(tx, uid, source.tag);

        // Get items
        let items = await tx.feedItem.findMany({
            where: {
                fid: id,
                seq: after !== null ? { gt: after } : (before !== null ? { lt: before } : undefined)
            },
            orderBy: [{
                seq: 'desc'
            }],
            take: 21
        });

        // Resolve next cursor
        let next: number | null = null;
        if (items.length === 21) {
            next = items[20].seq;
        }

        // Return sessions
        return {
            items,
            next
        };
    });
}

//
// Feed State
//

export async function getNextFeedSeqnoAndId(tx: Tx, uid: string, tag: string) {
    let existing = await tx.feed.findFirst({ where: { userId: uid, tag: tag } });
    if (!existing) {
        const feed = await tx.feed.create({ data: { userId: uid, tag: tag, seq: 1 } });
        return { seq: 0, id: feed.id };
    } else {
        await tx.feed.update({ where: { id: existing.id }, data: { seq: existing.seq + 1 } });
        return { seq: existing.seq, id: existing.id };
    }
}

export async function getFeedSeqno(tx: Tx, uid: string, source: FeedSource<any>) {
    let existing = await tx.feed.findFirst({ where: { userId: uid, tag: source.tag } });
    if (existing) {
        return existing.seq;
    } else {
        return 0;
    }
}

export async function getFeedId(tx: Tx, uid: string, tag: string) {
    let existing = await tx.feed.findFirst({ where: { userId: uid, tag: tag } });
    if (!existing) {
        return (await tx.feed.create({
            data: {
                userId: uid, tag: tag, seq: 0
            }
        })).id;
    } else {
        return existing.id;
    }
}