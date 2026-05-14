// ===== 基础配置：定义目录映射关系 =====
const materialConfig = [
  { category: "nai", name: "奶", prefix: "奶龙素材", path: "/images/photos/奶/" },
  { category: "naiguo", name: "奶果", prefix: "奶果素材", path: "/images/photos/奶果/" },
  { category: "naiqi", name: "奶气", prefix: "奶气素材", path: "/images/photos/奶气/" },
  { category: "gifs", name: "动态表情", prefix: "动态表情", path: "/images/gifs/" },
  { category: "letters", name: "奶龙字母", prefix: "字母素材", path: "/images/奶龙字母/" },
  { category: "stickers", name: "表情包", prefix: "表情包", path: "/images/表情包/" }
];

const BASE_URL = "https://image.hakimi.uno";
var materialGroups = []; // 动态填充后的全局变量
var bannerSlides = [];   // 动态生成的轮播图

// ===== 核心：异步获取所有资源列表 =====
async function fetchAllMaterials() {
  try {
    const promises = materialConfig.map(async (cfg) => {
      const response = await fetch(BASE_URL + cfg.path);
      if (!response.ok) throw new Error("无法访问 " + cfg.path);
      const json = await response.json();

      return {
        category: cfg.category,
        categoryName: cfg.name,
        titlePrefix: cfg.prefix,
        folder: BASE_URL + cfg.path,
        // 过滤文件，只保留图片
        files: json
          .filter(f => f.type === 'file' && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
          .map(f => f.name)
      };
    });

    materialGroups = await Promise.all(promises);

    // 数据准备好后，初始化依赖数据的模块
    initDynamicModules();

  } catch (error) {
    console.error("加载素材失败:", error);
    hideLoadingMask();
    alert("素材库加载失败，请检查网络或 Nginx 配置。");
  }
}

// ===== 初始化依赖数据的模块 =====
function initDynamicModules() {
  // 1. 生成轮播图数据 (原逻辑：从第 4 个分类 gifs 中随机抽 3 张)
  var time = new Date().getTime();
  var gifGroup = materialGroups[3]; // gifs 所在的索引
  if (gifGroup && gifGroup.files.length > 0) {
    while (bannerSlides.length < 3 && gifGroup.files.length >= 3) {
      var fileIndex = Math.floor(Math.random() * gifGroup.files.length);
      var file = gifGroup.files[fileIndex] + "?t=" + time;
      var fullSrc = gifGroup.folder + file;

      if (!bannerSlides.some(s => s.src === fullSrc)) {
        bannerSlides.push({ src: fullSrc, alt: gifGroup.categoryName });
      }
    }
  }

  hideLoadingMask();
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
}

// ===== 页面加载入口 =====
document.addEventListener("DOMContentLoaded", function () {
  showLoadingMask();
  fetchAllMaterials();
  initFloatAd();
});

var categoryState = {
  currentCategory: "all",
  currentPage: 1,
  pageSize: 9
};

// ===== 用户状态：读取本地保存的用户名 =====
function showCurrentUser() {
  var userSpans = document.querySelectorAll("#currentUser");
  var username = localStorage.getItem("nailongUser") || "游客";
  for (var i = 0; i < userSpans.length; i++) {
    userSpans[i].textContent = username;
  }
}

// ===== 表单提示：把错误文字写到指定元素里 =====
function setError(id, message) {
  var element = document.getElementById(id);
  if (element) {
    element.textContent = message;
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
    var password = document.getElementById("password") ? document.getElementById("password").value : null;
    var pass = true;

    setError("usernameError", "");
    if (password !== null) setError("passwordError", "");

    if (username.length < 2 || username.length > 12) {
      setError("usernameError", "昵称需要 2-12 位。");
      pass = false;
    }

    if (password !== null) {
      if (password.length < 6 || password.length > 20) {
        setError("passwordError", "密码需要 6-20 位。");
        pass = false;
      } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setError("passwordError", "密码需同时包含字母和数字。");
        pass = false;
      }
    }

    if (pass) {
      localStorage.setItem("nailongUser", username);
      showCurrentUser();
      alert("登录成功，欢迎 " + username + "！");
      location.href = "index.html";
    }
  };
}

// ===== 人格测试页：根据答题分值判断奶龙类型 =====
var personalityTypes = [
  {
    name: "社恐奶龙",
    desc: "你不是不喜欢奶龙，你只是喜欢在心里喜欢。遇见奶龙你会假装没看见，但回家后会在脑子里把那段相遇回放七八次。你的情感储量其实很充足，只是出口很窄。奶龙如果会读心术，一定会被你感动哭的——可惜它不会。",
    groupIndex: 2
  },
  {
    name: "淡定奶龙",
    desc: "你和奶龙之间有种心照不宣的默契：你知道它好，它也知道你知道，但你们都不急着挑明。遇事先录视频，见面先存备注，这不是冷漠，这是成熟。奶龙私下跟别人说，这个人是真的靠谱。",
    groupIndex: 1
  },
  {
    name: "社牛奶龙",
    desc: "奶龙还没搞清楚状况，你已经把它拉进三个群了。你的世界里没有陌生的奶龙，只有还没熟的奶龙。这种能量很稀缺，奶龙宇宙需要你——但偶尔也记得给奶龙留点喘息的空间，它是真的有点跟不上。",
    groupIndex: 0
  }
];

function initPersonalityForm() {
  var form = document.getElementById("personalityForm");
  if (!form) {
    return;
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    var name = document.getElementById("testName").value.trim();
    var q1 = document.getElementById("q1").value;
    var q2 = document.getElementById("q2").value;
    var q3 = document.getElementById("q3").value;
    var q4 = document.getElementById("q4").value;
    var pass = true;

    setError("testNameError", "");
    setError("q1Error", "");
    setError("q2Error", "");
    setError("q3Error", "");
    setError("q4Error", "");

    if (name === "") {
      setError("testNameError", "先给自己取个昵称。");
      pass = false;
    }
    if (q1 === "") { setError("q1Error", "这题不能跳过。"); pass = false; }
    if (q2 === "") { setError("q2Error", "这题不能跳过。"); pass = false; }
    if (q3 === "") { setError("q3Error", "这题不能跳过。"); pass = false; }
    if (q4 === "") { setError("q4Error", "这题不能跳过。"); pass = false; }

    if (!pass) return;

    var score = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4);
    var typeIndex = score <= 4 ? 0 : score <= 8 ? 1 : 2;
    var type = personalityTypes[typeIndex];
    var group = materialGroups[type.groupIndex];

    if (!group || group.files.length === 0) return;

    // 用分值决定取哪张图，同分同结果
    var fileIndex = score % group.files.length;
    var file = group.files[fileIndex];

    localStorage.setItem("nailongUser", name);
    showCurrentUser();

    document.getElementById("testResultImage").src = group.folder + file;
    document.getElementById("testResultImage").alt = type.name;
    document.getElementById("testResultTitle").textContent = name + " 是" + type.name;
    var desc = document.getElementById("testResultDesc");
    if (desc) desc.innerHTML = type.desc + '<br><span style="display:inline-block;margin-top:10px;font-size:13px;color:#aaa;">奶龙指数 ' + score + ' / 12</span>';
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
    paths.push(BASE_URL + "/images/奶龙字母/OK.jpg");
  } else {
    for (var i = 0; i < word.length; i++) {
      paths.push(BASE_URL + "/images/奶龙字母/" + word.charAt(i) + ".jpg");
    }
  }

  loadImages(paths, function (images, failed) {
    if (failed > 0) {
      setError("wordInputError", "有字母素材加载失败，请稍后重试。");
      return;
    }

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

    try {
      download.href = canvas.toDataURL("image/png");
      download.download = "nailong-word-" + word + ".png";
      download.className = "btn primary";
    } catch (error) {
      console.error("导出图片失败:", error);
      setError("wordInputError", "当前环境不允许导出跨域图片，请在同源站点访问或开启图片 CORS。");
      download.removeAttribute("href");
      download.className = "btn";
    }
  });
}

// ===== 图片加载：等所有字母图片加载完成后再绘制 =====
function loadImages(paths, callback) {
  var images = [];
  var loaded = 0;
  var failed = 0;

  if (paths.length === 0) {
    callback(images, failed);
    return;
  }

  for (var i = 0; i < paths.length; i++) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      loaded++;
      if (loaded === paths.length) {
        callback(images, failed);
      }
    };
    img.onerror = function () {
      failed++;
      loaded++;
      if (loaded === paths.length) {
        callback(images, failed);
      }
    };
    img.src = paths[i];
    images.push(img);
  }
}

// ===== 首页拼贴轮播：切换 active，让当前 GIF 放大 =====
function initSlider() {
  var cards = document.querySelectorAll(".collage-card");
  if (cards.length === 0) {
    return;
  }
  var imgs = document.querySelectorAll(".collage-card img");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].src = bannerSlides[i].src;
    imgs[i].alt = bannerSlides[i].alt;
  }

  var index = 0;

  function showSlide(nextIndex) {
    index = nextIndex;
    for (var i = 0; i < cards.length; i++) {
      cards[i].className = "collage-card";
    }
    cards[index].className = "collage-card active";
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
      button.textContent = "点击播放";
    });
  }

  button.onclick = function () {
    video.muted = false;
    video.volume = 1;
    video.play();
    button.textContent = "正在大笑";
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

// ===== 分类页：根据 materialGroups 动态生成分类按钮 =====
function renderCategoryTabs() {
  var tabsContainer = document.getElementById("categoryTabs");
  if (!tabsContainer) {
    return;
  }

  var html = '<button class="tab active" type="button" data-category="all">全部</button>';
  for (var i = 0; i < materialGroups.length; i++) {
    html += '<button class="tab" type="button" data-category="' + materialGroups[i].category + '">' + materialGroups[i].categoryName + '</button>';
  }

  tabsContainer.innerHTML = html;
}

// ===== 分类页：绑定分类按钮并渲染素材 =====
function initCategoryPage() {
  var grid = document.getElementById("categoryGrid");
  if (!grid) {
    return;
  }

  renderCategoryTabs();

  var tabsContainer = document.getElementById("categoryTabs");
  if (!tabsContainer) {
    return;
  }

  var tabs = tabsContainer.querySelectorAll(".tab");
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

// ===== 分页组件：生成带省略号和前后翻页的分页按钮 =====
function buildPagination(current, total) {
  if (total <= 1) return "";
  var html = "";

  // 上一页
  html += '<button type="button" ' + (current === 1 ? "disabled" : 'data-page="' + (current - 1) + '"') + '>&laquo;</button>';

  // 计算要显示哪些页码
  var pages = [];
  var left = current - 2;
  var right = current + 2;
  if (left < 1) { right += (1 - left); left = 1; }
  if (right > total) { left -= (right - total); right = total; }
  if (left < 1) left = 1;

  if (left > 1) { pages.push(1); if (left > 2) pages.push("..."); }
  for (var i = left; i <= right; i++) pages.push(i);
  if (right < total) { if (right < total - 1) pages.push("..."); pages.push(total); }

  for (var j = 0; j < pages.length; j++) {
    if (pages[j] === "...") {
      html += '<span class="page-ellipsis">...</span>';
    } else {
      html += '<button type="button" class="' + (pages[j] === current ? "active" : "") + '" data-page="' + pages[j] + '">' + pages[j] + '</button>';
    }
  }

  // 下一页
  html += '<button type="button" ' + (current === total ? "disabled" : 'data-page="' + (current + 1) + '"') + '>&raquo;</button>';

  return html;
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

  pagination.innerHTML = buildPagination(categoryState.currentPage, totalPages);

  var pageButtons = pagination.querySelectorAll("button");
  for (var b = 0; b < pageButtons.length; b++) {
    pageButtons[b].onclick = function () {
      var page = this.getAttribute("data-page");
      if (!page) return;
      categoryState.currentPage = parseInt(page, 10);
      renderCategoryItems();
      var gridEl = document.getElementById("categoryGrid");
      if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  initCardOpen();
  initDragAndDrop();
}

// ===== 分类页：点击素材卡片时加入收藏，双击预览大图 =====
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
    cards[i].ondblclick = function (e) {
      e.stopPropagation();
      var img = this.querySelector("img");
      if (img) openLightbox(img.src, this.getAttribute("data-title"));
    };
    cards[i].onkeydown = function (event) {
      if (event.key === "Enter") this.click();
      if (event.key === " ") {
        event.preventDefault();
        var img = this.querySelector("img");
        if (img) openLightbox(img.src, this.getAttribute("data-title"));
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

// ===== 加载遮罩 =====
var loadingMaskEl = null;

function showLoadingMask() {
  if (loadingMaskEl) return;
  loadingMaskEl = document.createElement("div");
  loadingMaskEl.className = "loading-mask";
  loadingMaskEl.innerHTML = '<div class="loading-spinner"></div><p>素材加载中…</p>';
  document.body.appendChild(loadingMaskEl);
}

function hideLoadingMask() {
  if (!loadingMaskEl) return;
  loadingMaskEl.classList.add("hide");
  setTimeout(function () {
    if (loadingMaskEl && loadingMaskEl.parentNode) {
      loadingMaskEl.parentNode.removeChild(loadingMaskEl);
      loadingMaskEl = null;
    }
  }, 380);
}

// ===== 浮动提醒关闭 =====
function initFloatAd() {
  var ad = document.getElementById("floatAd");
  var btn = document.getElementById("floatClose");
  if (!ad || !btn) return;
  btn.onclick = function () {
    ad.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    ad.style.opacity = "0";
    ad.style.transform = "translateY(16px)";
    setTimeout(function () {
      if (ad.parentNode) ad.parentNode.removeChild(ad);
    }, 320);
  };
}

// ===== 图片灯箱 =====
function openLightbox(src, alt) {
  var box = document.createElement("div");
  box.className = "lightbox";
  box.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="关闭">×</button>' +
    '<img src="' + src + '" alt="' + (alt || "") + '">';

  function close() {
    if (box.parentNode) box.parentNode.removeChild(box);
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
  }

  box.onclick = function (e) {
    if (e.target === box || e.target.className === "lightbox-close") close();
  };
  document.addEventListener("keydown", onKey);
  document.body.appendChild(box);
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
