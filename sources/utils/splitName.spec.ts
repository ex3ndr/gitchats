import { splitName } from "./splitName";

describe('splitName', () => {
    it('should split names', () => {
        const cases: [string, string, string | null][] = [
            ['A B', 'A', 'B'],
            ['A', 'A', null],
            ['A B C', 'A', 'B C'],
            ['A B C D', 'A', 'B C D'],
            ['A B C D E', 'A', 'B C D E'],
        ]
        for (let c of cases) {
            const { first, last } = splitName(c[0]);
            expect(first).toBe(c[1]);
            expect(last).toBe(c[2]);
        }
    });
});