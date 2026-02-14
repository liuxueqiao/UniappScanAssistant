const User = require("../models/User");
const Team = require("../models/Team");
const WeightRecord = require("../models/WeightRecord");
const Challenge = require("../models/Challenge");
const Article = require("../models/Article");
const { startOfWeekMonday, endOfWeekSunday, toDateOnlyKey } = require("../utils/date");

function toNumber(v, d) {
  const n = Number(v);
  if (!Number.isFinite(n)) return d;
  return n;
}

async function listUsers(req, res, next) {
  try {
    const limit = toNumber(req.query.limit, 50);
    const offset = toNumber(req.query.offset, 0);
    const items = await User.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 200))
      .lean();
    return res.json({
      items: items.map((u) => ({
        id: String(u._id),
        nickname: u.nickname,
        avatarUrl: u.avatarUrl,
        initialWeightKg: u.initialWeightKg,
        targetWeightKg: u.targetWeightKg,
        heightCm: u.heightCm,
        teamId: u.teamId ? String(u.teamId) : null,
        lastCheckInDateKey: u.lastCheckInDateKey,
        streakDays: u.streakDays,
        createdAt: u.createdAt
      }))
    });
  } catch (err) {
    return next(err);
  }
}

async function listTeams(req, res, next) {
  try {
    const limit = toNumber(req.query.limit, 50);
    const offset = toNumber(req.query.offset, 0);
    const items = await Team.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 200))
      .lean();
    return res.json({
      items: items.map((t) => ({
        id: String(t._id),
        name: t.name,
        ownerId: String(t.ownerId),
        inviteCode: t.inviteCode,
        memberCount: Array.isArray(t.members) ? t.members.length : 0,
        createdAt: t.createdAt
      }))
    });
  } catch (err) {
    return next(err);
  }
}

async function listWeights(req, res, next) {
  try {
    const limit = toNumber(req.query.limit, 50);
    const offset = toNumber(req.query.offset, 0);
    const userId = req.query.userId;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const q = {};
    if (userId) q.userId = userId;
    if (dateFrom || dateTo) {
      q.dateKey = {};
      if (dateFrom) q.dateKey.$gte = dateFrom;
      if (dateTo) q.dateKey.$lte = dateTo;
    }
    const items = await WeightRecord.find(q)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 500))
      .lean();
    return res.json({
      items: items.map((w) => ({
        id: String(w._id),
        userId: String(w.userId),
        dateKey: w.dateKey,
        weightKg: w.weightKg,
        createdAt: w.createdAt
      }))
    });
  } catch (err) {
    return next(err);
  }
}

async function listChallenges(req, res, next) {
  try {
    const limit = toNumber(req.query.limit, 50);
    const offset = toNumber(req.query.offset, 0);
    const items = await Challenge.find({})
      .sort({ startAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 200))
      .lean();
    return res.json({
      items: items.map((c) => ({
        id: String(c._id),
        type: c.type,
        title: c.title,
        weekKey: c.weekKey,
        startAt: c.startAt,
        endAt: c.endAt,
        targetLossKg: c.targetLossKg,
        participants: Array.isArray(c.participants)
          ? c.participants.map((p) => ({
              userId: String(p.userId),
              joinedAt: p.joinedAt,
              startWeightKg: p.startWeightKg,
              endWeightKg: p.endWeightKg,
              deltaKg: p.deltaKg,
              lossRate: p.lossRate,
              completed: p.completed
            }))
          : []
      }))
    });
  } catch (err) {
    return next(err);
  }
}

async function listArticles(req, res, next) {
  try {
    const limit = toNumber(req.query.limit, 50);
    const offset = toNumber(req.query.offset, 0);
    const items = await Article.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 200))
      .lean();
    return res.json({
      items: items.map((a) => ({
        id: String(a._id),
        title: a.title,
        coverUrl: a.coverUrl,
        status: a.status,
        publishedAt: a.publishedAt,
        createdAt: a.createdAt
      }))
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listUsers, listTeams, listWeights, listChallenges, listArticles };

async function createChallenge(req, res, next) {
  try {
    const title = String(req.body?.title || "").trim();
    const targetLossKg = Number(req.body?.targetLossKg || 1);
    const start = req.body?.startAt ? new Date(req.body.startAt) : new Date();
    if (!title) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "title is required" } });
    }
    if (!Number.isFinite(targetLossKg) || targetLossKg <= 0) {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "invalid targetLossKg" } });
    }
    const startAt = startOfWeekMonday(start);
    const endAt = endOfWeekSunday(start);
    const weekKey = toDateOnlyKey(startAt);
    const existed = await Challenge.findOne({ weekKey });
    if (existed) {
      return res.status(409).json({ error: { code: "CONFLICT", message: "challenge already exists for week" } });
    }
    const challenge = await Challenge.create({
      type: "weight_loss_weekly",
      title,
      weekKey,
      startAt,
      endAt,
      targetLossKg,
      participants: []
    });
    return res.json({ challengeId: String(challenge._id) });
  } catch (err) {
    return next(err);
  }
}

module.exports.createChallenge = createChallenge;
