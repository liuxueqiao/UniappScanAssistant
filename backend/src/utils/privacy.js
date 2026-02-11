function safeDeltaKg(startKg, endKg) {
  if (typeof startKg !== "number" || typeof endKg !== "number") return null;
  return Number((startKg - endKg).toFixed(2));
}

function safeLossRate(startKg, endKg) {
  if (typeof startKg !== "number" || typeof endKg !== "number") return null;
  if (startKg <= 0) return null;
  return Number(((startKg - endKg) / startKg).toFixed(4));
}

module.exports = { safeDeltaKg, safeLossRate };

