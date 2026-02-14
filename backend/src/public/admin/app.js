const base = location.origin;
const keyEl = document.getElementById("key");

// Init
keyEl.value = localStorage.getItem("admin_key") || "";

// Helpers
function saveKey() {
  localStorage.setItem("admin_key", keyEl.value.trim());
}

function h() {
  const k = (localStorage.getItem("admin_key") || "").trim();
  return { "x-admin-key": k };
}

function setStatus(t, type = "info") {
  const el = document.getElementById("status");
  el.innerText = t;
  el.className = "status-bar visible " + (type === "error" ? "error" : "");

  // Auto hide after 3 seconds for info
  if (type === "info") {
    setTimeout(() => {
      if (el.innerText === t) {
        // check if still same message
        el.classList.remove("visible");
      }
    }, 5000);
  }
}

function setActiveNav(id) {
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Hide all views
  document.getElementById("content").style.display = "none";
  document.getElementById("viewCreateArticle").style.display = "none";
  document.getElementById("viewCreateChallenge").style.display = "none";

  // Show specific view based on ID
  if (id === "btnNewArticle") {
    document.getElementById("viewCreateArticle").style.display = "block";
  } else if (id === "btnNewChallenge") {
    document.getElementById("viewCreateChallenge").style.display = "block";
  } else {
    document.getElementById("content").style.display = "block";
  }
}

function renderCell(col, val, row) {
  if (val === null || val === undefined)
    return '<span class="text-muted">-</span>';

  // Image columns
  if (["avatarUrl", "coverUrl"].includes(col)) {
    if (!val) return '<div class="avatar-placeholder"></div>';
    return `<img src="${val}" class="table-img" loading="lazy" />`;
  }

  // Date columns
  if (
    [
      "createdAt",
      "updatedAt",
      "publishedAt",
      "startAt",
      "endAt",
      "joinedAt",
    ].includes(col)
  ) {
    if (!val || val === "-") return "-";
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      return `<span class="date-badge" title="${d.toLocaleString()}">${d.toLocaleDateString()}</span>`;
    } catch (e) {
      return val;
    }
  }

  // Status/Boolean
  if (col === "status") {
    const map = { published: "success", draft: "warning" };
    const cls = map[val] || "info";
    const label = { published: "已发布", draft: "草稿" }[val] || val;
    return `<span class="badge badge-${cls}">${label}</span>`;
  }

  // Specific formatting
  if (col === "weightKg" || col === "targetLossKg") {
    if (val === "-") return "-";
    return `<strong>${val}</strong> <small class="text-muted">kg</small>`;
  }

  if (col === "inviteCode") {
    return `<code style="background:#f4f4f5;padding:2px 4px;border-radius:4px;color:#d63384">${val}</code>`;
  }

  return String(val);
}

function setTable(columns, rows, type) {
  window._tableData = rows;
  const c = document.getElementById("content");
  if (!rows || rows.length === 0) {
    c.innerHTML =
      '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">暂无数据</div></div>';
    return;
  }

  const th = columns
    .map((col) => {
      const label =
        {
          id: "ID",
          nickname: "昵称",
          teamId: "小队ID",
          streakDays: "连续打卡",
          createdAt: "创建时间",
          name: "名称",
          ownerId: "队长ID",
          inviteCode: "邀请码",
          memberCount: "人数",
          weightKg: "体重",
          dateKey: "日期",
          title: "标题",
          weekKey: "周期",
          targetLossKg: "目标减重",
          startAt: "开始时间",
          endAt: "结束时间",
          type: "类型",
          status: "状态",
          publishedAt: "发布时间",
          avatarUrl: "头像",
          coverUrl: "封面",
        }[col] || col;
      return `<th>${label}</th>`;
    })
    .join("");

  const actionTh = type ? "<th>操作</th>" : "";

  const trs = rows
    .map(
      (r) =>
        "<tr>" +
        columns
          .map((col) => `<td>${renderCell(col, r[col], r)}</td>`)
          .join("") +
        (type
          ? `<td class="actions-cell">
              ${
                r.id && r.id !== "-"
                  ? `<button class="btn-sm btn-danger" onclick="deleteItem('${type}', '${r.id}')">删除</button>
                     <button class="btn-sm" onclick="editItem('${type}', '${r.id}')">编辑</button>`
                  : ""
              }
            </td>`
          : "") +
        "</tr>"
    )
    .join("");

  c.innerHTML = `
    <div class="table-responsive">
      <table>
        <thead><tr>${th}${actionTh}</tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  `;
}

// Global Actions
window.deleteItem = async (type, id) => {
  if (!confirm("确定要删除吗？此操作不可恢复！")) return;
  try {
    setStatus("删除中...", "info");
    const res = await fetch(`${base}/api/admin/${type}/${id}`, {
      method: "DELETE",
      headers: h(),
    });
    if (!res.ok) throw new Error("删除失败 HTTP " + res.status);
    setStatus("删除成功", "info");
    // Reload current tab
    const activeBtn = document.querySelector(".nav-btn.active");
    if (activeBtn) activeBtn.click();
  } catch (e) {
    setStatus(e.message, "error");
  }
};

let currentEdit = null;

window.closeModal = () => {
  const el = document.getElementById("editModal");
  el.classList.remove("visible");
  currentEdit = null;
};

window.editItem = async (type, id) => {
  currentEdit = { type, id };
  const modal = document.getElementById("editModal");
  const form = document.getElementById("modalForm");
  const title = document.getElementById("modalTitle");

  form.innerHTML = '<div style="text-align:center;color:#999;">加载中...</div>';
  title.innerText = `编辑 ${type}/${id}`;
  modal.classList.add("visible");

  try {
    // We need to fetch current data first.
    // Since we don't have a single item fetch API for all, we rely on the list data or fetch list again with filter if possible.
    // BUT, we can just fetch the list (which is cached/fast) and find the item in memory if we had it,
    // or just fetch the list again. Since we don't store global list state easily, let's just fetch list and find.
    // Or better, let's assume we can fetch list with limit=1&id=... no, backend doesn't support filter by ID generally except findById.
    // Actually, we can't easily get the SINGLE item details unless we have an API for it.
    // However, our update API is PATCH, so we can just show empty fields or try to find it from the DOM/Table?
    // No, parsing DOM is bad.
    // Let's iterate the current rows in table? No global state.
    // Let's just make a quick hack: fetch the list again (maybe inefficient but works) or
    // improve the backend to get single item.
    // For now, let's just create the inputs blank or try to get from a global cache.
    // Let's modify setTable to store data in a global map.

    const item = window._tableData?.find((x) => x.id === id);
    if (!item) {
      form.innerHTML = "无法获取数据，请刷新后重试";
      return;
    }

    let fields = [];
    if (type === "users") {
      fields = [
        { key: "nickname", label: "昵称" },
        { key: "initialWeightKg", label: "初始体重", type: "number" },
        { key: "targetWeightKg", label: "目标体重", type: "number" },
        { key: "heightCm", label: "身高", type: "number" },
      ];
    } else if (type === "teams") {
      fields = [
        { key: "name", label: "小队名称" },
        { key: "inviteCode", label: "邀请码" },
      ];
    } else if (type === "challenges") {
      fields = [
        { key: "title", label: "标题" },
        { key: "targetLossKg", label: "目标减重", type: "number" },
      ];
    } else if (type === "articles") {
      fields = [
        { key: "title", label: "标题" },
        { key: "coverUrl", label: "封面 URL" },
        {
          key: "status",
          label: "状态",
          type: "select",
          options: ["draft", "published"],
        },
      ];
    } else if (type === "weights") {
      fields = [
        { key: "weightKg", label: "体重", type: "number" },
        { key: "dateKey", label: "日期 (YYYY-MM-DD)" },
      ];
    }

    form.innerHTML = fields
      .map((f) => {
        if (f.type === "select") {
          return `
          <div class="modal-input-group">
            <label>${f.label}</label>
            <select id="edit_${f.key}">
              ${f.options
                .map(
                  (o) =>
                    `<option value="${o}" ${
                      item[f.key] === o ? "selected" : ""
                    }>${o}</option>`
                )
                .join("")}
            </select>
          </div>
        `;
        }
        return `
        <div class="modal-input-group">
          <label>${f.label}</label>
          <input id="edit_${f.key}" value="${
          item[f.key] !== null && item[f.key] !== undefined ? item[f.key] : ""
        }" type="${f.type || "text"}">
        </div>
      `;
      })
      .join("");
  } catch (e) {
    form.innerText = e.message;
  }
};

window.saveEdit = async () => {
  if (!currentEdit) return;
  const { type, id } = currentEdit;

  try {
    setStatus("保存中...", "info");
    const inputs = document.querySelectorAll(
      "#modalForm input, #modalForm select"
    );
    const body = {};

    inputs.forEach((el) => {
      const key = el.id.replace("edit_", "");
      let val = el.value;
      if (el.type === "number") {
        val = Number(val);
      }
      body[key] = val;
    });

    const res = await fetch(`${base}/api/admin/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...h() },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("更新失败 HTTP " + res.status);

    setStatus("更新成功", "info");
    closeModal();
    const activeBtn = document.querySelector(".nav-btn.active");
    if (activeBtn) activeBtn.click();
  } catch (e) {
    setStatus(e.message, "error");
    alert(e.message);
  }
};

// Actions
async function testAdmin() {
  try {
    saveKey();
    setStatus("测试连接中...", "info");
    const health = await fetch(base + "/health");
    if (!health.ok) {
      throw new Error("后端不可用 HTTP " + health.status);
    }
    const users = await fetch(base + "/api/admin/users?limit=3", {
      headers: h(),
    });
    if (!users.ok) {
      throw new Error(
        "管理员验证失败 HTTP " + users.status + " (请检查 Admin Key)"
      );
    }
    const data = await users.json();
    setStatus("✅ 连接成功 | 示例用户数：" + (data.items || []).length, "info");
  } catch (e) {
    setStatus("❌ " + e.message, "error");
    console.error(e);
  }
}

async function get(url) {
  const res = await fetch(url, { headers: h() });
  if (!res.ok) {
    if (res.status === 403) throw new Error("无权限 (403)");
    throw new Error("HTTP " + res.status);
  }
  return res.json();
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

// Search Helper
function getSearchQuery() {
  const q = document.getElementById("searchInput").value.trim();
  return q ? `&q=${encodeURIComponent(q)}` : "";
}

// Loaders
async function loadUsers() {
  setActiveNav("btnUsers");
  try {
    setStatus("加载用户列表...", "info");
    const data = await get(
      base + "/api/admin/users?limit=100" + getSearchQuery()
    );
    setStatus("用户列表加载完成 | 共 " + data.items.length + " 条", "info");
    setTable(
      ["id", "avatarUrl", "nickname", "teamId", "streakDays", "createdAt"],
      data.items,
      "users"
    );
  } catch (e) {
    setStatus("加载失败：" + e.message, "error");
  }
}

async function loadTeams() {
  setActiveNav("btnTeams");
  try {
    setStatus("加载小队列表...", "info");
    const data = await get(
      base + "/api/admin/teams?limit=100" + getSearchQuery()
    );
    setStatus("小队列表加载完成 | 共 " + data.items.length + " 条", "info");
    setTable(
      ["id", "name", "ownerId", "inviteCode", "memberCount", "createdAt"],
      data.items,
      "teams"
    );
  } catch (e) {
    setStatus("加载失败：" + e.message, "error");
  }
}

async function loadWeights() {
  setActiveNav("btnWeights");
  try {
    setStatus("加载签到记录...", "info");
    const data = await get(base + "/api/admin/weights?limit=200"); // No search for weights yet
    setStatus("签到记录加载完成 | 共 " + data.items.length + " 条", "info");
    setTable(
      ["id", "userId", "dateKey", "weightKg", "createdAt"],
      data.items,
      "weights"
    );
  } catch (e) {
    setStatus("加载失败：" + e.message, "error");
  }
}

async function loadChallenges() {
  setActiveNav("btnChallenges");
  try {
    setStatus("加载挑战活动...", "info");
    const data = await get(
      base + "/api/admin/challenges?limit=50" + getSearchQuery()
    );
    setStatus("挑战活动加载完成 | 共 " + data.items.length + " 条", "info");

    const rows = [];
    data.items.forEach((it) => {
      rows.push({
        id: it.id,
        title: it.title,
        weekKey: it.weekKey,
        targetLossKg: it.targetLossKg,
        startAt: it.startAt,
        endAt: it.endAt,
        type: "【主活动】",
      });
      (it.participants || []).forEach((p) => {
        rows.push({
          id: "-",
          title: "↳ 参与者: " + p.userId,
          weekKey: it.weekKey,
          targetLossKg: "-",
          startAt: p.joinedAt,
          endAt: "-",
          type: "参与记录",
        });
      });
    });
    setTable(
      ["id", "type", "title", "weekKey", "targetLossKg", "startAt", "endAt"],
      rows,
      "challenges"
    );
  } catch (e) {
    setStatus("加载失败：" + e.message, "error");
  }
}

async function loadArticles() {
  setActiveNav("btnArticles");
  try {
    setStatus("加载文章列表...", "info");
    const data = await get(
      base + "/api/admin/articles?limit=100" + getSearchQuery()
    );
    setStatus("文章列表加载完成 | 共 " + data.items.length + " 条", "info");
    setTable(
      ["id", "coverUrl", "title", "status", "publishedAt", "createdAt"],
      data.items,
      "articles"
    );
  } catch (e) {
    setStatus("加载失败：" + e.message, "error");
  }
}

// Form Handlers
async function createArticle() {
  const title = document.getElementById("aTitle").value.trim();
  const coverUrl = document.getElementById("aCover").value.trim();
  const content = document.getElementById("aContent").value.trim();
  const status = document.getElementById("aStatus").value;

  if (!title || !content) {
    return setStatus("请填写标题和内容", "error");
  }

  try {
    setStatus("正在发布文章...", "info");
    await post(base + "/api/admin/articles", {
      title,
      coverUrl,
      content,
      status,
    });
    setStatus("✅ 文章发布成功", "info");
    document.getElementById("aTitle").value = "";
    document.getElementById("aCover").value = "";
    document.getElementById("aContent").value = "";
    loadArticles();
  } catch (e) {
    setStatus("发布失败：" + e.message, "error");
  }
}

async function createChallenge() {
  const title = document.getElementById("cTitle").value.trim();
  const targetLossKg = parseFloat(document.getElementById("cTarget").value);
  const startAt = document.getElementById("cStart").value;

  if (!title || !targetLossKg || !startAt) {
    return setStatus("请填写完整挑战信息", "error");
  }

  try {
    setStatus("正在创建挑战...", "info");
    await post(base + "/api/admin/challenges", {
      title,
      targetLossKg,
      startAt, // Backend handles weekKey calc
    });
    setStatus("✅ 挑战创建成功", "info");
    document.getElementById("cTitle").value = "";
    document.getElementById("cTarget").value = "";
    loadChallenges();
  } catch (e) {
    setStatus("创建失败：" + e.message, "error");
  }
}

// Bind Events
document.getElementById("btnSave").onclick = () => {
  saveKey();
  setStatus("Key 已保存", "info");
};
document.getElementById("btnTest").onclick = testAdmin;

document.getElementById("btnUsers").onclick = loadUsers;
document.getElementById("btnTeams").onclick = loadTeams;
document.getElementById("btnWeights").onclick = loadWeights;
document.getElementById("btnChallenges").onclick = loadChallenges;
document.getElementById("btnArticles").onclick = loadArticles;

document.getElementById("btnCreateArticle").onclick = createArticle;
document.getElementById("btnCreateChallenge").onclick = createChallenge;

document.getElementById("btnSearch").onclick = () => {
  const activeBtn = document.querySelector(".nav-btn.active");
  if (activeBtn) {
    // Only reload if it's a list view button
    const id = activeBtn.id;
    if (
      [
        "btnUsers",
        "btnTeams",
        "btnWeights",
        "btnChallenges",
        "btnArticles",
      ].includes(id)
    ) {
      activeBtn.click();
    }
  }
};
document.getElementById("searchInput").onkeydown = (e) => {
  if (e.key === "Enter") document.getElementById("btnSearch").click();
};

// New Nav Handlers
document.getElementById("btnNewArticle").onclick = () => {
  setActiveNav("btnNewArticle");
  setStatus("请填写文章信息", "info");
};
document.getElementById("btnNewChallenge").onclick = () => {
  setActiveNav("btnNewChallenge");
  setStatus("请填写挑战信息", "info");
};
