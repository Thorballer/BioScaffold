/**
 * Seeded PRNG — mulberry32 algorithm
 * Produces deterministic random numbers from a seed.
 * Same seed = same sequence. Different seed = different sequence.
 */

export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

export class SeededRandom {
    private state: number;

    constructor(seed: number | string) {
        this.state = typeof seed === 'string' ? hashString(seed) : seed;
        // Ensure non-zero state
        if (this.state === 0) this.state = 1;
    }

    /** Returns a float in [0, 1) */
    next(): number {
        // mulberry32
        let t = (this.state += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /** Returns an integer in [0, max) */
    nextInt(max: number): number {
        return Math.floor(this.next() * max);
    }

    /** Fisher-Yates shuffle (in-place) */
    shuffle<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = this.nextInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}
