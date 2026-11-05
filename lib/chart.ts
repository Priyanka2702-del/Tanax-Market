export interface Candle { o: number; h: number; l: number; c: number }

/** Deterministic PRNG so server and client render identical charts. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeCandles(seed: number, count: number, drift = 0.15): Candle[] {
  const rnd = mulberry32(seed);
  const out: Candle[] = [];
  let price = 50;
  for (let i = 0; i < count; i++) {
    const o = price;
    const c = o + (rnd() - 0.5 + drift * 0.3) * 8;
    const h = Math.max(o, c) + rnd() * 3;
    const l = Math.min(o, c) - rnd() * 3;
    out.push({ o, h, l, c });
    price = c;
  }
  return out;
}

export function makeSeries(seed: number, count: number, drift = 0.2): number[] {
  return makeCandles(seed, count, drift).map((c) => c.c);
}
