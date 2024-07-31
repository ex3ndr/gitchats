//
// NOTE: This objects are delivered directly to the client, so they should be as small as possible and not leak internal information.
//

export type UpdateProfileChanged = {
    type: 'profile-changed'
};

export type UpdateType = UpdateProfileChanged;