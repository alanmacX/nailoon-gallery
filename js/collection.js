onReady(initCollectionPage);

function initCollectionPage() {
  var board = document.getElementById("collectionGrid");
  if (!board) return;

  var favorites = JSON.parse(localStorage.getItem("nailongFavorites") || "[]");
  if (favorites.length === 0) {
    board.innerHTML = '<p class="empty-note">冰箱门还空着。回到分类页，把喜欢的素材拖进收藏篮。</p>';
    return;
  }

  var positions = JSON.parse(localStorage.getItem("nailongNotePositions") || "{}");
  var html = "";
  favorites.forEach(function (fav, i) {
    var left = positions[fav.key] ? positions[fav.key].left : 34 + (i % 4) * 205;
    var top = positions[fav.key] ? positions[fav.key].top : 38 + Math.floor(i / 4) * 230;
    var rotate = positions[fav.key] ? positions[fav.key].rotate : (i % 2 === 0 ? -4 : 4);
    html += '<article class="fridge-note" data-key="' + fav.key + '" data-rotate="' + rotate + '" style="left:' + left + 'px;top:' + top + 'px;transform:rotate(' + rotate + 'deg);">';
    html += '<img src="' + fav.image + '" alt="' + fav.title + '"><h3>' + fav.title + '</h3></article>';
  });
  board.innerHTML = html;

  board.querySelectorAll(".fridge-note").forEach(function (note) {
    note.onmousedown = function (e) {
      e.preventDefault();
      var boardRect = board.getBoundingClientRect();
      var offX = e.clientX - note.getBoundingClientRect().left;
      var offY = e.clientY - note.getBoundingClientRect().top;
      var rot = note.dataset.rotate || "0";
      note.style.zIndex = 99;
      note.style.transform = "rotate(0deg) scale(1.05)";

      document.onmousemove = function (me) {
        var l = Math.min(Math.max(me.clientX - boardRect.left - offX, 0), board.clientWidth - note.offsetWidth);
        var t = Math.min(Math.max(me.clientY - boardRect.top - offY, 0), board.clientHeight - note.offsetHeight);
        note.style.left = l + "px";
        note.style.top = t + "px";
      };
      document.onmouseup = function () {
        note.style.transform = "rotate(" + rot + "deg)";
        var pos = JSON.parse(localStorage.getItem("nailongNotePositions") || "{}");
        pos[note.dataset.key] = { left: parseInt(note.style.left), top: parseInt(note.style.top), rotate: parseInt(rot) };
        localStorage.setItem("nailongNotePositions", JSON.stringify(pos));
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  });
}
