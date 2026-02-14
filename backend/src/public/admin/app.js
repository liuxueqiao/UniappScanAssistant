const base = location.origin;
const keyEl = document.getElementById("key");
keyEl.value = localStorage.getItem("admin_key") || "";
function saveKey() {
  localStorage.setItem("admin_key", keyEl.value.trim());
}
function h() {
  const k = (localStorage.getItem("admin_key") || "").trim();
  return { "x-admin-key": k };
}
function setStatus(t) {
  document.getElementById("status").innerText = t;
}
function setTable(columns, rows) {
  const c = document.getElementById("content");
  const th = columns.map((c) => "<th>" + c + "</th>").join("");
  const trs = rows
    .map(
      (r) =>
        "<tr>" +
        columns.map((c) => "<td>" + String(r[c] ?? "") + "</td>").join("") +
        "</tr>"
    )
    .join("");
  c.innerHTML =
    "<table><thead><tr>" +
    th +
    "</tr></thead><tbody>" +
    trs +
    "</tbody></table>";
}
async function testAdmin() {
  try {
    saveKey();
    setStatus("测试中...");
    const health = await fetch(base + "/health");
    if (!health.ok) {
      throw new Error("后端不可用 HTTP " + health.status);
    }
    const users = await fetch(base + "/api/admin/users?limit=3", {
      headers: h(),
    });
    if (!users.ok) {
      throw new Error(
        "管理员接口错误 HTTP " + users.status + "（请检查 Admin Key）"
      );
    }
    const data = await users.json();
    setStatus(
      "后端正常；管理员验证通过；示例用户数：" + (data.items || []).length
    );
  } catch (e) {
    setStatus("失败：" + e.message);
    console.error(e);
  }
}
async function get(url) {
  const res = await fetch(url, { headers: h() });
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  return res.json();
}
async function loadUsers() {
  try {
    setStatus("加载用户...");
    const data = await get(base + "/api/admin/users?limit=100");
    setStatus("共 " + data.items.length + " 条");
    setTable(
      ["id", "nickname", "teamId", "streakDays", "createdAt"],
      data.items
    );
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
async function loadTeams() {
  try {
    setStatus("加载小队...");
    const data = await get(base + "/api/admin/teams?limit=100");
    setStatus("共 " + data.items.length + " 条");
    setTable(
      ["id", "name", "ownerId", "inviteCode", "memberCount", "createdAt"],
      data.items
    );
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
async function loadWeights() {
  try {
    setStatus("加载签到...");
    const data = await get(base + "/api/admin/weights?limit=200");
    setStatus("共 " + data.items.length + " 条");
    setTable(["id", "userId", "dateKey", "weightKg", "createdAt"], data.items);
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
async function loadChallenges() {
  try {
    setStatus("加载挑战...");
    const data = await get(base + "/api/admin/challenges?limit=50");
    setStatus("共 " + data.items.length + " 条");
    const rows = [];
    data.items.forEach((it) => {
      rows.push({
        id: it.id,
        title: it.title,
        weekKey: it.weekKey,
        targetLossKg: it.targetLossKg,
        startAt: it.startAt,
        endAt: it.endAt,
      });
      (it.participants || []).forEach((p) => {
        rows.push({
          id: "",
          title: "参与",
          weekKey: it.weekKey,
          targetLossKg: "",
          startAt: p.userId,
          endAt: p.joinedAt,
        });
      });
    });
    setTable(
      ["id", "title", "weekKey", "targetLossKg", "startAt", "endAt"],
      rows
    );
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
async function loadArticles() {
  try {
    setStatus("加载文章...");
    const data = await get(base + "/api/admin/articles?limit=100");
    setStatus("共 " + data.items.length + " 条");
    setTable(["id", "title", "status", "publishedAt", "createdAt"], data.items);
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}

async function post(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...h() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("HTTP " + res.status + " " + t);
  }
  return res.json();
}
async function createArticle() {
  try {
    setStatus("发布文章中...");
    const title = document.getElementById("aTitle").value.trim();
    const coverUrl = document.getElementById("aCover").value.trim();
    const content = document.getElementById("aContent").value;
    const status = document.getElementById("aStatus").value;
    const data = await post(base + "/api/articles", {
      title,
      coverUrl,
      content,
      status,
    });
    setStatus("发布成功，id=" + data.article.id);
    await loadArticles();
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
async function createChallenge() {
  try {
    setStatus("创建挑战中...");
    const title = document.getElementById("cTitle").value.trim();
    const targetLossKg = Number(
      document.getElementById("cTarget").value || "1"
    );
    const startInput = document.getElementById("cStart").value;
    const startAt = startInput
      ? new Date(startInput + "T00:00:00").toISOString()
      : new Date().toISOString();
    const data = await post(base + "/api/admin/challenges", {
      title,
      targetLossKg,
      startAt,
    });
    setStatus("创建成功，id=" + data.challengeId);
    await loadChallenges();
  } catch (e) {
    setStatus("失败：" + e.message);
  }
}
document.getElementById("btnSave").addEventListener("click", saveKey);
document.getElementById("btnTest").addEventListener("click", testAdmin);
document.getElementById("btnUsers").addEventListener("click", loadUsers);
document.getElementById("btnTeams").addEventListener("click", loadTeams);
document.getElementById("btnWeights").addEventListener("click", loadWeights);
document
  .getElementById("btnChallenges")
  .addEventListener("click", loadChallenges);
document.getElementById("btnArticles").addEventListener("click", loadArticles);
document
  .getElementById("btnCreateArticle")
  .addEventListener("click", createArticle);
document
  .getElementById("btnCreateChallenge")
  .addEventListener("click", createChallenge);
