//
// NOTE: This objects are delivered directly to the client, so they should be as small as possible and not leak internal information.
//

//
// Profile
//

export type UpdateProfileChanged = {
    type: 'profile-changed'
};

//
// Feed
//

export type UpdateFeedPosted = {
    type: 'feed-posted';
    source: string;
    seq: number;
    date: number;
    by: string;
    content: any;
    repeatKey: string | null;
    localKey?: string | null | undefined;
};

export type UpdateFeedUpdated = {
    type: 'feed-updated';
    source: string;
    seq: number;
    date: number;
    by: string;
    content: any;
};

export type UpdateFeedDeleted = {
    type: 'feed-deleted';
    source: string;
    seq: number;
};

export type UpdateType = UpdateProfileChanged | UpdateFeedPosted | UpdateFeedUpdated | UpdateFeedDeleted;