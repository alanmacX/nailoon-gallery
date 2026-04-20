// ===== 素材数据：按文件夹分类保存 =====
var materialGroups = [
  {
    category: "nai",
    categoryName: "奶",
    titlePrefix: "奶龙素材",
    folder: "images/photos/奶/",
    files: [
      "图片00001.jpg",
      "图片00003.jpg",
      "图片00004.jpg",
      "图片00005.jpg",
      "图片00006.jpg",
      "图片00007.jpg",
      "图片00008.png",
      "图片00009.jpg",
      "图片00010.png",
      "图片00011.jpg",
      "图片00012.jpg",
      "图片00013.jpg",
      "图片00015.jpg",
      "图片00016.jpg",
      "图片00017.jpg",
      "图片00018.jpg",
      "图片00019.jpg",
      "图片00020.jpg",
      "图片00021.jpg",
      "图片00022.jpg",
      "图片00023.jpg"
    ]
  },
  {
    category: "naiguo",
    categoryName: "奶果",
    titlePrefix: "奶果素材",
    folder: "images/photos/奶果/",
    files: [
      "图片00001.jpg",
      "图片00002.png",
      "图片00003.png",
      "图片00004.png",
      "图片00005.png",
      "图片00006.png",
      "图片00007.png"
    ]
  },
  {
    category: "naiqi",
    categoryName: "奶气",
    titlePrefix: "奶气素材",
    folder: "images/photos/奶气/",
    files: [
      "图片00001.jpg",
      "图片00002.jpg",
      "图片00004.jpg",
      "图片00006.jpg",
      "图片00007.jpg",
      "图片00008.jpg",
      "图片00009.jpg"
    ]
  },
  {
    category: "gifs",
    categoryName: "动态表情",
    titlePrefix: "动态表情",
    folder: "images/gifs/",
    files: [
      "gif1.jpg",
      "gif2.jpg",
      "gif3.jpg",
      "gif4.jpg",
      "gif5.jpg",
      "gif6.jpg",
      "gif7.jpg",
      "gif8.jpg",
      "gif9.jpg",
      "gif10.jpg",
      "gif11.jpg",
      "gif12.jpg",
      "gif13.jpg",
      "gif14.jpg",
      "gif15.jpg",
      "gif16.jpg",
      "gif17.jpg"
    ]
  },
  {
    category: "letters",
    categoryName: "奶龙字母",
    titlePrefix: "字母素材",
    folder: "images/奶龙字母/",
    files: [
      "OK.jpg",
      "A.jpg",
      "B.jpg",
      "C.jpg",
      "D.jpg",
      "E.jpg",
      "F.jpg",
      "G.jpg",
      "H.jpg",
      "I.jpg",
      "J.jpg",
      "K.jpg",
      "L.jpg",
      "M.jpg",
      "N.jpg",
      "O.jpg",
      "P.jpg",
      "Q.jpg",
      "R.jpg",
      "S.jpg",
      "T.jpg",
      "U.jpg",
      "V.jpg",
      "W.jpg",
      "X.jpg",
      "Y.jpg",
      "Z.jpg"
    ]
  }
];

// ===== 首页轮播图：从动态表情文件夹中随机抽 3 张 =====
var bannerSlides = [];
for(var i = 0;i < 3;i++) {
  var group = materialGroups[3];
  var fileIndex = Math.floor(Math.random() * group.files.length);
  var file = group.files[fileIndex];
  bannerSlides.push({
    src: group.folder + file,
    alt: group.categoryName
  });
}

var categoryState = {
  currentCategory: "all",
  currentPage: 1,
  pageSize: 9
};

// ===== 页面加载后，按页面上是否存在对应元素来初始化功能 =====
document.addEventListener("DOMContentLoaded", function () {
  showCurrentUser();
  initLoginForm();
  initPersonalityForm();
  initWordForm();
  initSlider();
  initSmileVideo();
  initCanvas();
  initCollectionPage();
  initCategoryPage();
  initDragAndDrop();
});

// ===== 用户状态：读取本地保存的用户名 =====
function showCurrentUser() {
  var userSpans = document.querySelectorAll("#currentUser");
  var username = localStorage.getItem("nailongUser") || "游客";
  for (var i = 0; i < userSpans.length; i++) {
    userSpans[i].innerHTML = username;
  }
}

// ===== 表单提示：把错误文字写到指定元素里 =====
function setError(id, message) {
  var element = document.getElementById(id);
  if (element) {
    element.innerHTML = message;
  }
}

// ===== 登录页：昵称验证 =====
function initLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    var username = document.getElementById("username").value.trim();
    var pass = true;

    setError("usernameError", "");

    if (username.length < 2 || username.length > 12) {
      setError("usernameError", "昵称需要 2-12 位。");
      pass = false;
    }

    if (pass) {
      localStorage.setItem("nailongUser", username);
      showCurrentUser();
      alert("登录成功，欢迎 " + username + "！");
      location.href = "index.html";
    }
  };
}

// ===== 人格测试页：表单验证后随机抽一张奶龙照片 =====
function initPersonalityForm() {
  var form = document.getElementById("personalityForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    var name = document.getElementById("testName").value.trim();
    var mood = document.getElementById("moodChoice").value;
    var color = document.getElementById("colorChoice").value;
    var snack = document.getElementById("snackChoice").value;
    var pass = true;

    setError("testNameError", "");
    setError("moodChoiceError", "");
    setError("colorChoiceError", "");
    setError("snackChoiceError", "");

    if (name === "") {
      setError("testNameError", "先给自己取个昵称。");
      pass = false;
    }

    if (mood === "") {
      setError("moodChoiceError", "请选择今天的状态。");
      pass = false;
    }

    if (color === "") {
      setError("colorChoiceError", "请选择一个颜色。");
      pass = false;
    }

    if (snack === "") {
      setError("snackChoiceError", "请选择一个场景。");
      pass = false;
    }

    if (pass) {
      localStorage.setItem("nailongUser", name);
      showCurrentUser();
      var groupIndex = Math.floor(Math.random() * 3);
      var group = materialGroups[groupIndex];
      var fileIndex = Math.floor(Math.random() * group.files.length);
      var file = group.files[fileIndex];
      var number = fileIndex + 1;
      var title = group.titlePrefix + " " + (number < 10 ? "0" + number : number);

      document.getElementById("testResultImage").src = group.folder + file;
      document.getElementById("testResultImage").alt = title;
      document.getElementById("testResultTitle").innerHTML = name + "，你是这个奶龙";
    }
  };
}

// ===== 奶龙组词页：验证输入，只允许 1-15 个英文字母 =====
function initWordForm() {
  var form = document.getElementById("wordForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    var value = document.getElementById("wordInput").value.trim().toUpperCase();
    setError("wordInputError", "");

    if (value === "") {
      setError("wordInputError", "请输入 1-15 个英文字母。");
      return;
    }

    if (value.length > 15) {
      setError("wordInputError", "最多输入 15 个字母。");
      return;
    }

    if (!/^[A-Z]+$/.test(value)) {
      setError("wordInputError", "只能输入英文字母，不能输入中文、数字或符号。");
      return;
    }

    drawWordImage(value);
  };
}

// ===== 奶龙组词页：把字母图片画到 Canvas，并生成下载链接 =====
function drawWordImage(word) {
  var canvas = document.getElementById("wordCanvas");
  var download = document.getElementById("downloadWord");
  if (!canvas || !canvas.getContext || !download) {
    return;
  }

  var paths = [];
  if (word === "OK") {
    paths.push("images/奶龙字母/OK.jpg");
  } else {
    for (var i = 0; i < word.length; i++) {
      paths.push("images/奶龙字母/" + word.charAt(i) + ".jpg");
    }
  }

  loadImages(paths, function (images) {
    var ctx = canvas.getContext("2d");
    var cell = 120;
    var gap = 0;
    canvas.width = images.length * cell;
    canvas.height = 120;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < images.length; i++) {
      var x = i * (cell + gap);
      ctx.drawImage(images[i], x, 0, cell, cell);
    }

    download.href = canvas.toDataURL("image/png");
    download.download = "nailong-word-" + word + ".png";
    download.className = "btn primary";
  });
}

// ===== 图片加载：等所有字母图片加载完成后再绘制 =====
function loadImages(paths, callback) {
  var images = [];
  var loaded = 0;
  for (var i = 0; i < paths.length; i++) {
    var img = new Image();
    img.onload = function () {
      loaded++;
      if (loaded === paths.length) {
        callback(images);
      }
    };
    img.src = paths[i];
    images.push(img);
  }
}

// ===== 首页拼贴轮播：切换 active，让当前 GIF 放大 =====
function initSlider() {
  var cards = document.querySelectorAll(".collage-card");
  var dots = document.querySelectorAll(".slide-dot");
  if (cards.length === 0 || dots.length === 0) {
    return;
  }
  var imgs = document.querySelectorAll(".collage-card img");
  for(var i = 0;i < imgs.length;i++) {
    imgs[i].src = bannerSlides[i].src;
    imgs[i].alt = bannerSlides[i].alt;
  }

  var index = 0;

  function showSlide(nextIndex) {
    index = nextIndex;
    for (var i = 0; i < cards.length; i++) {
      cards[i].className = "collage-card";
      dots[i].className = "slide-dot";
    }
    cards[index].className = "collage-card active";
    dots[index].className = "slide-dot active";
  }

  for (var i = 0; i < dots.length; i++) {
    dots[i].onclick = function () {
      showSlide(parseInt(this.getAttribute("data-slide"), 10));
    };
  }

  setInterval(function () {
    var next = (index + 1) % cards.length;
    showSlide(next);
  }, 3000);
}

// ===== 大笑视频页：自动静音播放，点击按钮后打开声音 =====
function initSmileVideo() {
  var video = document.getElementById("smileVideo");
  var button = document.getElementById("smilePlayButton");
  if (!video || !button) {
    return;
  }

  video.muted = true;
  var playResult = video.play();
  if (playResult) {
    playResult.catch(function () {
      button.innerHTML = "点击播放";
    });
  }

  button.onclick = function () {
    video.muted = false;
    video.volume = 1;
    video.play();
    button.innerHTML = "正在大笑";
  };
}

// ===== 首页 Canvas：按素材分类数量绘制动态占比图 =====
function initCanvas() {
  var canvas = document.getElementById("moodCanvas");
  if (!canvas || !canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext("2d");
  var total = 0;
  var colors = ["#ffd447", "#74d3ff", "#00a878", "#ff6f61", "#111827"];
  var progress = 0;

  for (var i = 0; i < materialGroups.length; i++) {
    total += materialGroups[i].files.length;
  }

  function drawFrame() {
    progress += 0.035;
    if (progress > 1) {
      progress = 1;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#111827";
    ctx.fillText("素材占比统计", 20, 32);

    var startAngle = -Math.PI / 2;
    for (var i = 0; i < materialGroups.length; i++) {
      var angle = (materialGroups[i].files.length / total) * Math.PI * 2 * progress;
      ctx.beginPath();
      ctx.moveTo(94, 118);
      ctx.arc(94, 118, 62, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += angle;
    }

    for (var j = 0; j < materialGroups.length; j++) {
      var y = 58 + j * 28;
      ctx.fillStyle = colors[j];
      ctx.fillRect(190, y, 16, 16);
      ctx.fillStyle = "#111827";
      ctx.font = "14px Arial";
      ctx.fillText(materialGroups[j].categoryName + " " + materialGroups[j].files.length, 214, y + 13);
    }

    ctx.fillStyle = "#667085";
    ctx.fillText("总数 " + total, 190, 202);

    if (progress < 1) {
      requestAnimationFrame(drawFrame);
    }
  }

  drawFrame();
}

// ===== 分类页：绑定分类按钮并渲染素材 =====
function initCategoryPage() {
  var grid = document.getElementById("categoryGrid");
  if (!grid) {
    return;
  }

  var tabs = document.querySelectorAll(".tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].onclick = function () {
      categoryState.currentCategory = this.getAttribute("data-category");
      categoryState.currentPage = 1;
      for (var j = 0; j < tabs.length; j++) {
        tabs[j].className = "tab";
      }
      this.className = "tab active";
      renderCategoryItems();
    };
  }

  renderCategoryItems();
}

// ===== 分类页：直接展开 materialGroups，生成当前分类的卡片和分页 =====
function renderCategoryItems() {
  var grid = document.getElementById("categoryGrid");
  var pagination = document.getElementById("pagination");
  var list = [];

  for (var i = 0; i < materialGroups.length; i++) {
    var group = materialGroups[i];
    if (categoryState.currentCategory !== "all" && group.category !== categoryState.currentCategory) {
      continue;
    }

    for (var j = 0; j < group.files.length; j++) {
      var file = group.files[j];
      var number = j + 1;
      var title = group.titlePrefix + " " + (number < 10 ? "0" + number : number);
      if (group.category === "letters") {
        title = file.replace(".jpg", "");
      }
      list.push({
        category: group.category,
        file: file,
        title: title,
        image: group.folder + file
      });
    }
  }

  var totalPages = Math.ceil(list.length / categoryState.pageSize);
  var start = (categoryState.currentPage - 1) * categoryState.pageSize;
  var pageItems = list.slice(start, start + categoryState.pageSize);
  var html = "";

  for (var k = 0; k < pageItems.length; k++) {
    html += '<article class="feature-card gallery-card" draggable="true" data-title="' + pageItems[k].title + '" data-category="' + pageItems[k].category + '" data-file="' + pageItems[k].file + '" tabindex="0">';
    html += '<img src="' + pageItems[k].image + '" alt="' + pageItems[k].title + '">';
    html += "<h3>" + pageItems[k].title + "</h3>";
    html += "</article>";
  }

  grid.innerHTML = html;

  var pageHtml = "";
  for (var page = 1; page <= totalPages; page++) {
    pageHtml += '<button type="button" class="' + (page === categoryState.currentPage ? "active" : "") + '" data-page="' + page + '">' + page + "</button>";
  }
  pagination.innerHTML = pageHtml;

  var pageButtons = pagination.querySelectorAll("button");
  for (var b = 0; b < pageButtons.length; b++) {
    pageButtons[b].onclick = function () {
      categoryState.currentPage = parseInt(this.getAttribute("data-page"), 10);
      renderCategoryItems();
    };
  }

  initCardOpen();
  initDragAndDrop();
}

// ===== 分类页：点击素材卡片时加入收藏 =====
function initCardOpen() {
  var cards = document.querySelectorAll(".feature-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].onclick = function () {
      var category = this.getAttribute("data-category");
      var file = this.getAttribute("data-file");
      var title = this.getAttribute("data-title");
      if (category && file) {
        addFavorite(category, file, title);
        renderFavoriteList();
      }
    };
    cards[i].onkeydown = function (event) {
      if (event.key === "Enter") {
        this.click();
      }
    };
  }
}

// ===== 收藏页：把已收藏素材渲染成冰箱贴墙 =====
function initCollectionPage() {
  var grid = document.getElementById("collectionGrid");
  if (!grid) {
    return;
  }

  var favorites = getFavorites();
  if (favorites.length === 0) {
    grid.innerHTML = '<p class="empty-note">冰箱门还空着。回到分类页，把喜欢的素材拖进收藏篮。</p>';
    return;
  }

  var positions = getNotePositions();
  var html = "";
  for (var i = 0; i < favorites.length; i++) {
    var left = 34 + i % 4 * 205;
    var top = 38 + Math.floor(i / 4) * 230;
    var rotate = i % 2 === 0 ? -4 : 4;
    if (positions[favorites[i].key]) {
      left = positions[favorites[i].key].left;
      top = positions[favorites[i].key].top;
      rotate = positions[favorites[i].key].rotate;
    }
    html += '<article class="fridge-note" data-key="' + favorites[i].key + '" data-rotate="' + rotate + '" style="left:' + left + 'px; top:' + top + 'px; transform: rotate(' + rotate + 'deg);">';
    html += '<img src="' + favorites[i].image + '" alt="' + favorites[i].title + '">';
    html += "<h3>" + favorites[i].title + "</h3>";
    html += "</article>";
  }
  grid.innerHTML = html;
  initFridgeDrag(grid);
}

// ===== 收藏页：读取和保存每张冰箱贴的位置 =====
function getNotePositions() {
  var text = localStorage.getItem("nailongNotePositions");
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return {};
  }
}

function saveNotePositions(positions) {
  localStorage.setItem("nailongNotePositions", JSON.stringify(positions));
}

// ===== 收藏页：鼠标拖动冰箱贴，松手后保存位置 =====
function initFridgeDrag(board) {
  var notes = board.querySelectorAll(".fridge-note");
  var maxZ = 10;

  for (var i = 0; i < notes.length; i++) {
    notes[i].onmousedown = function (event) {
      event.preventDefault();
      var note = this;
      var boardRect = board.getBoundingClientRect();
      var noteRect = note.getBoundingClientRect();
      var offsetX = event.clientX - noteRect.left;
      var offsetY = event.clientY - noteRect.top;
      var rotate = note.getAttribute("data-rotate") || "0";

      maxZ++;
      note.style.zIndex = maxZ;
      note.className = "fridge-note dragging";
      note.style.transform = "rotate(0deg) scale(1.05)";

      document.onmousemove = function (moveEvent) {
        var left = moveEvent.clientX - boardRect.left - offsetX;
        var top = moveEvent.clientY - boardRect.top - offsetY;
        var maxLeft = board.clientWidth - note.offsetWidth;
        var maxTop = board.clientHeight - note.offsetHeight;

        if (left < 0) {
          left = 0;
        }
        if (top < 0) {
          top = 0;
        }
        if (left > maxLeft) {
          left = maxLeft;
        }
        if (top > maxTop) {
          top = maxTop;
        }

        note.style.left = left + "px";
        note.style.top = top + "px";
      };

      document.onmouseup = function () {
        note.className = "fridge-note";
        note.style.transform = "rotate(" + rotate + "deg)";

        var positions = getNotePositions();
        positions[note.getAttribute("data-key")] = {
          left: parseInt(note.style.left, 10),
          top: parseInt(note.style.top, 10),
          rotate: parseInt(rotate, 10)
        };
        saveNotePositions(positions);

        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
}

// ===== 首页和分类页：拖放素材到收藏篮 =====
function initDragAndDrop() {
  var cards = document.querySelectorAll(".feature-card");
  var dropZone = document.getElementById("dropZone");
  var favoriteList = document.getElementById("favoriteList");
  var clearButton = document.getElementById("clearFavorites");
  if (!dropZone || !favoriteList) {
    return;
  }

  if (clearButton) {
    clearButton.onclick = function () {
      saveFavorites([]);
      saveNotePositions({});
      renderFavoriteList();
    };
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].ondragstart = function (event) {
      event.dataTransfer.setData("text/plain", this.getAttribute("data-title"));
      event.dataTransfer.setData("text/category", this.getAttribute("data-category") || "");
      event.dataTransfer.setData("text/file", this.getAttribute("data-file") || "");
    };
  }

  dropZone.ondragover = function (event) {
    event.preventDefault();
    dropZone.className = "drop-zone over";
  };

  dropZone.ondragleave = function () {
    dropZone.className = "drop-zone";
  };

  dropZone.ondrop = function (event) {
    event.preventDefault();
    var title = event.dataTransfer.getData("text/plain");
    var category = event.dataTransfer.getData("text/category");
    var file = event.dataTransfer.getData("text/file");
    if (title && category && file) {
      addFavorite(category, file, title);
      renderFavoriteList();
    }
    dropZone.className = "drop-zone";
  };

  renderFavoriteList();
}

// ===== 收藏数据：读取和保存 localStorage =====
function getFavorites() {
  var text = localStorage.getItem("nailongFavorites");
  if (!text) {
    return [];
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem("nailongFavorites", JSON.stringify(list));
}

// ===== 收藏数据：根据分类和文件名加入收藏 =====
function addFavorite(category, file, title) {
  var image = "";
  for (var i = 0; i < materialGroups.length; i++) {
    if (materialGroups[i].category === category) {
      image = materialGroups[i].folder + file;
    }
  }

  if (image === "") {
    return;
  }

  var list = getFavorites();
  var key = category + "|" + file;
  var exists = false;

  for (var j = 0; j < list.length; j++) {
    if (list[j].key === key) {
      exists = true;
    }
  }

  if (!exists) {
    list.push({
      key: key,
      category: category,
      file: file,
      title: title,
      image: image
    });
    saveFavorites(list);
  }
}

// ===== 收藏篮：显示收藏项，并支持单个删除 =====
function renderFavoriteList() {
  var favoriteList = document.getElementById("favoriteList");
  if (!favoriteList) {
    return;
  }

  var favorites = getFavorites();
  var html = "";
  for (var i = 0; i < favorites.length; i++) {
    html += '<li><span>' + favorites[i].title + '</span><button type="button" data-index="' + i + '">删除</button></li>';
  }
  favoriteList.innerHTML = html;

  var buttons = favoriteList.querySelectorAll("button");
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].onclick = function () {
      var index = parseInt(this.getAttribute("data-index"), 10);
      var list = getFavorites();
      var removed = list[index];
      var positions = getNotePositions();
      if (removed && positions[removed.key]) {
        delete positions[removed.key];
        saveNotePositions(positions);
      }
      list.splice(index, 1);
      saveFavorites(list);
      renderFavoriteList();
    };
  }
}
