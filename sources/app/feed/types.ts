import { ContentKind } from './content';

export abstract class FeedSource<T extends ContentKind> {

    static fromPublicId(publicId: string): FeedSource<any> {
        if (publicId === 'home') {
            return feedSourceHome();
        }
        if (publicId.startsWith('u_')) {
            return new FeedSourceUserHome(publicId.slice(2));
        }
        throw new Error('Invalid feed tag');
    }

    abstract content: T;
    abstract readonly publicId: string;
    abstract readonly tag: string;
}

export class FeedSourceHome implements FeedSource<'home'> {
    content: 'home' = 'home';
    publicId = 'home';
    tag = 'home';
}

export class FeedSourceUserHome implements FeedSource<'home'> {
    content: 'home' = 'home';
    readonly publicId: string;
    readonly tag: string;
    constructor(public userId: string) {
        this.publicId = `u_${userId}`;
        this.tag = `user:${userId}`;
    }
}

export function feedSourceHome(): FeedSourceHome {
    return new FeedSourceHome();
}

export function feedSourceUserHome(userId: string): FeedSourceUserHome {
    return new FeedSourceUserHome(userId);
}