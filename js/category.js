var curCategory = "all";
var curPage = 1;
var pageSize = 12;

onReady(async function () {
  await fetchAllMaterials();
  initCategoryPage();
  initDragAndDrop();
});

function initCategoryPage() {
  var grid = document.getElementById("categoryGrid");
  if (!grid) return;

  var params = new URLSearchParams(location.search);
  curCategory = params.get("cat") || "all";

  var tabsEl = document.getElementById("categoryTabs");
  var html = '<button class="tab' + (curCategory === "all" ? " active" : "") + '" type="button" data-category="all">全部</button>';
  materialGroups.forEach(function (g) {
    html += '<button class="tab' + (curCategory === g.category ? " active" : "") + '" type="button" data-category="' + g.category + '">' + g.categoryName + '</button>';
  });
  tabsEl.innerHTML = html;

  tabsEl.querySelectorAll(".tab").forEach(function (btn) {
    btn.onclick = function () {
      tabsEl.querySelectorAll(".tab").forEach(function (b) { b.className = "tab"; });
      btn.className = "tab active";
      curCategory = btn.dataset.category;
      curPage = 1;
      renderCategoryItems();
    };
  });

  renderCategoryItems();
}

function renderCategoryItems() {
  var grid = document.getElementById("categoryGrid");
  var pgEl = document.getElementById("pagination");
  var list = [];

  materialGroups.forEach(function (g) {
    if (curCategory !== "all" && g.category !== curCategory) return;
    g.files.forEach(function (file, j) {
      var title = g.category === "letters" ? file.replace(".jpg", "") : g.titlePrefix + " " + (j + 1 < 10 ? "0" + (j + 1) : j + 1);
      list.push({ category: g.category, file: file, title: title, image: g.folder + file });
    });
  });

  var totalPages = Math.ceil(list.length / pageSize) || 1;
  if (curPage > totalPages) curPage = totalPages;
  var pageItems = list.slice((curPage - 1) * pageSize, curPage * pageSize);

  grid.innerHTML = pageItems.map(function (item) {
    return '<article class="feature-card gallery-card" draggable="true" data-title="' + item.title + '" data-category="' + item.category + '" data-file="' + item.file + '" tabindex="0">' +
      '<img src="' + item.image + '" alt="' + item.title + '"><h3>' + item.title + '</h3></article>';
  }).join("");

  var pgHtml = '<button type="button"' + (curPage === 1 ? " disabled" : ' data-page="' + (curPage - 1) + '"') + '>&laquo;</button>';
  for (var p = 1; p <= totalPages; p++) {
    pgHtml += '<button type="button" class="' + (p === curPage ? "active" : "") + '" data-page="' + p + '">' + p + '</button>';
  }
  pgHtml += '<button type="button"' + (curPage === totalPages ? " disabled" : ' data-page="' + (curPage + 1) + '"') + '>&raquo;</button>';
  pgEl.innerHTML = pgHtml;

  pgEl.querySelectorAll("button").forEach(function (btn) {
    btn.onclick = function () {
      if (!btn.dataset.page) return;
      curPage = parseInt(btn.dataset.page);
      renderCategoryItems();
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });

  grid.querySelectorAll(".feature-card").forEach(function (card) {
    card.onclick = function () {
      location.href = "detail.html?category=" + encodeURIComponent(card.dataset.category) + "&file=" + encodeURIComponent(card.dataset.file);
    };
    card.ondblclick = function (e) {
      e.preventDefault();
      addFavorite(card.dataset.category, card.dataset.file, card.dataset.title);
      renderFavoriteList();
    };
    card.onkeydown = function (e) { if (e.key === "Enter") card.click(); };
  });

  initDragAndDrop();
}
