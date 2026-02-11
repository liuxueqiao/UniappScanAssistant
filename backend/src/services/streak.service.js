function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map((x) => Number(x));
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function diffDays(aKey, bKey) {
  const a = parseDateKey(aKey);
  const b = parseDateKey(bKey);
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

function applyCheckInStreak(user, newDateKey) {
  const last = user.lastCheckInDateKey;

  if (!last) {
    user.lastCheckInDateKey = newDateKey;
    user.streakDays = 1;
    return;
  }

  if (last === newDateKey) return;

  const delta = diffDays(newDateKey, last);
  if (delta === 1) {
    user.lastCheckInDateKey = newDateKey;
    user.streakDays = Number(user.streakDays || 0) + 1;
    return;
  }

  user.lastCheckInDateKey = newDateKey;
  user.streakDays = 1;
}

module.exports = { applyCheckInStreak };

