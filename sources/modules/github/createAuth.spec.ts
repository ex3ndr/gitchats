import { createAuth } from "./createAuth";

describe('createAuth', () => {
    xit('should create auth', async () => {
        const auth = await createAuth();
        console.log(auth);
    });
});