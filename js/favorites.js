function addFavorite(category, file, title) {
  var group = getMaterialGroup(category);
  if (!group) return;

  var list = JSON.parse(localStorage.getItem("nailongFavorites") || "[]");
  var key = category + "|" + file;
  if (!list.some(function (f) { return f.key === key; })) {
    list.push({ key: key, category: category, file: file, title: title, image: group.folder + file });
    localStorage.setItem("nailongFavorites", JSON.stringify(list));
  }
}

function renderFavoriteList() {
  var el = document.getElementById("favoriteList");
  if (!el) return;

  var list = JSON.parse(localStorage.getItem("nailongFavorites") || "[]");
  el.innerHTML = list.map(function (fav, i) {
    return '<li><span>' + fav.title + '</span><button type="button" data-index="' + i + '">删除</button></li>';
  }).join("");

  el.querySelectorAll("button").forEach(function (btn) {
    btn.onclick = function () {
      var list = JSON.parse(localStorage.getItem("nailongFavorites") || "[]");
      var removed = list.splice(parseInt(btn.dataset.index), 1)[0];
      localStorage.setItem("nailongFavorites", JSON.stringify(list));

      if (removed) {
        var pos = JSON.parse(localStorage.getItem("nailongNotePositions") || "{}");
        delete pos[removed.key];
        localStorage.setItem("nailongNotePositions", JSON.stringify(pos));
      }
      renderFavoriteList();
    };
  });
}

function initDragAndDrop() {
  var dropZone = document.getElementById("dropZone");
  if (!dropZone) return;

  var clearButton = document.getElementById("clearFavorites");
  if (clearButton) {
    clearButton.onclick = function () {
      localStorage.removeItem("nailongFavorites");
      localStorage.removeItem("nailongNotePositions");
      renderFavoriteList();
    };
  }

  document.querySelectorAll(".feature-card").forEach(function (card) {
    card.ondragstart = function (e) {
      e.dataTransfer.setData("text/plain", card.dataset.title);
      e.dataTransfer.setData("text/category", card.dataset.category || "");
      e.dataTransfer.setData("text/file", card.dataset.file || "");
    };
  });

  dropZone.ondragover = function (e) {
    e.preventDefault();
    dropZone.className = "drop-zone over";
  };
  dropZone.ondragleave = function () { dropZone.className = "drop-zone"; };
  dropZone.ondrop = function (e) {
    e.preventDefault();
    var title = e.dataTransfer.getData("text/plain");
    var category = e.dataTransfer.getData("text/category");
    var file = e.dataTransfer.getData("text/file");
    if (title && category && file) {
      addFavorite(category, file, title);
      renderFavoriteList();
    }
    dropZone.className = "drop-zone";
  };

  renderFavoriteList();
}
