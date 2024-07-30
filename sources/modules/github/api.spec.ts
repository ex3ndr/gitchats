import { getUserProfile } from "./api";

describe('github api', () => {
    it('should fetch user profile', async () => {
        const token = process.env.TEST_TOKEN!;
        const user = await getUserProfile(token);
        console.warn(user)
    })
});