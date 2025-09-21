const memory = new Map();

export function mockPriceINR(symbol) {
  const base = memory.get(symbol) ?? 500 + Math.random() * 3000;
  const next = base * (0.995 + Math.random() * 0.01);
  const price = Number(next.toFixed(4));
  memory.set(symbol, price);
  return price;
}
