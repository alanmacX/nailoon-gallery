onReady(async function () {
  await fetchAllMaterials();
  initDetailPage();
});

function initDetailPage() {
  var wrap = document.getElementById("detailWrap");
  if (!wrap) return;

  var params = new URLSearchParams(location.search);
  var category = params.get("category");
  var file = params.get("file");

  if (!category || !file) {
    wrap.innerHTML = '<p class="empty-note">没有指定素材，请从分类页点击进入。</p>';
    return;
  }

  var group = getMaterialGroup(category);
  if (!group) {
    wrap.innerHTML = '<p class="empty-note">找不到这个分类。</p>';
    return;
  }

  var imageSrc = group.folder + file;
  var title = file.replace(/\.\w+$/, "");
  if (category !== "letters") {
    var idx = group.files.indexOf(file);
    title = group.titlePrefix + " " + (idx + 1 < 10 ? "0" + (idx + 1) : idx + 1);
  }

  var html = '<div class="detail-card glass">';
  html += '<div class="detail-image-wrap"><img id="detailMainImg" src="' + imageSrc + '" alt="' + title + '"></div>';
  html += '<div class="detail-content">';
  html += '<h1>' + title + '</h1>';
  html += '<ul class="detail-list">';
  html += '<li>分类：' + group.categoryName + '</li>';
  html += '<li>文件名：' + file + '</li>';
  html += '<li>该分类共 ' + group.files.length + ' 张素材</li>';
  html += '</ul>';
  html += '<canvas id="detailCanvas" width="320" height="160"></canvas>';
  html += '<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">';
  html += '<button class="btn primary" id="detailFavBtn" type="button">收藏这张</button>';
  html += '<a class="btn secondary" href="category.html?cat=' + category + '">返回分类</a>';
  html += '</div></div></div>';

  html += '<section class="panel glass"><h2>同分类推荐</h2><div class="card-grid">';
  var shuffled = group.files.slice().sort(function () { return Math.random() - 0.5; });
  var count = 0;
  for (var j = 0; j < shuffled.length && count < 3; j++) {
    if (shuffled[j] === file) continue;
    var recTitle = category === "letters" ? shuffled[j].replace(/\.\w+$/, "") : group.titlePrefix + " " + (j + 1);
    html += '<article class="feature-card detail-rec-card" data-category="' + category + '" data-file="' + shuffled[j] + '" style="cursor:pointer">';
    html += '<img src="' + group.folder + shuffled[j] + '" alt="' + recTitle + '"><h3>' + recTitle + '</h3></article>';
    count++;
  }
  html += '</div></section>';

  wrap.innerHTML = html;

  drawDetailCanvas(title, group);
  bindDetailActions(category, file, title);
}

function drawDetailCanvas(title, group) {
  var cvs = document.getElementById("detailCanvas");
  if (!cvs) return;

  var ctx = cvs.getContext("2d");
  ctx.fillStyle = "#ffd447";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  ctx.font = "bold 22px Arial";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.fillText(title, cvs.width / 2, 60);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#555";
  ctx.fillText("分类：" + group.categoryName + " | 共 " + group.files.length + " 张", cvs.width / 2, 100);
  ctx.fillText("奶龙素材馆", cvs.width / 2, 135);
}

function bindDetailActions(category, file, title) {
  var favBtn = document.getElementById("detailFavBtn");
  if (favBtn) {
    favBtn.onclick = function () {
      addFavorite(category, file, title);
      favBtn.textContent = "已收藏 ✓";
      favBtn.disabled = true;
    };
  }

  document.querySelectorAll(".detail-rec-card").forEach(function (card) {
    card.onclick = function () {
      location.href = "detail.html?category=" + encodeURIComponent(card.dataset.category) + "&file=" + encodeURIComponent(card.dataset.file);
    };
  });
}
