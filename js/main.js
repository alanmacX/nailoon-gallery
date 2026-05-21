function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// 图床地址和素材分类配置
var BASE_URL = "https://image.hakimi.uno";
var materialGroups = [];
var bannerSlides = [];

var materialConfig = [
  { category: "nai", name: "奶", prefix: "奶龙素材", path: "/images/photos/奶/" },
  { category: "naiguo", name: "奶果", prefix: "奶果素材", path: "/images/photos/奶果/" },
  { category: "naiqi", name: "奶气", prefix: "奶气素材", path: "/images/photos/奶气/" },
  { category: "gifs", name: "动态表情", prefix: "动态表情", path: "/images/gifs/" },
  { category: "letters", name: "奶龙字母", prefix: "字母素材", path: "/images/奶龙字母/" },
  { category: "stickers", name: "表情包", prefix: "表情包", path: "/images/表情包/" }
];

// 分类页状态
var curCategory = "all";
var curPage = 1;
var pageSize = 12;

// 页面加载后先拉取所有素材列表
document.addEventListener("DOMContentLoaded", function () {
  fetchAllMaterials();
});

// 向图床发请求，拿到每个分类的文件列表
async function fetchAllMaterials() {
  try {
    var promises = materialConfig.map(async function (cfg) {
      var res = await fetch(BASE_URL + cfg.path);
      var json = await res.json();
      return {
        category: cfg.category,
        categoryName: cfg.name,
        titlePrefix: cfg.prefix,
        folder: BASE_URL + cfg.path,
        files: json
          .filter(function (f) {
            return f.type === "file" && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name);
          })
          .map(function (f) { return f.name; })
      };
    });
    materialGroups = await Promise.all(promises);
    initAll();
  } catch (e) {
    console.error("素材加载失败:", e);
  }
}

// 数据加载完后初始化各模块
function initAll() {
  // 从 gifs 分类随机抽 3 张做轮播
  var gifGroup = materialGroups[3];
  if (gifGroup && gifGroup.files.length >= 3) {
    var t = new Date().getTime();
    while (bannerSlides.length < 3) {
      var idx = Math.floor(Math.random() * gifGroup.files.length);
      var src = gifGroup.folder + gifGroup.files[idx] + "?t=" + t;
      if (!bannerSlides.some(function (s) { return s.src === src; })) {
        bannerSlides.push({ src: src, alt: "动态表情" });
      }
    }
  }

  showCurrentUser();
  initLoginForm();
  initPersonalityForm();
  initWordForm();
  initSlider();
  initCollectionPage();
  initCategoryPage();
  initDragAndDrop();
  initSmileVideo();
  initFloatAd();
  initDetailPage();
}

// 读取 localStorage 里保存的用户名并显示在导航栏
function showCurrentUser() {
  var name = localStorage.getItem("nailongUser") || "游客";
  document.querySelectorAll("#currentUser").forEach(function (el) {
    el.textContent = name;
  });
}

// 把错误提示写到对应的 span 里
function setError(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg;
}

// 登录页：验证昵称（2-12位）和密码（至少6位）
function initLoginForm() {
  var form = document.getElementById("loginForm");
  if (!form) return;

  form.onsubmit = function (e) {
    e.preventDefault();
    var name = document.getElementById("username").value.trim();
    var pwd = document.getElementById("password").value;
    var ok = true;

    setError("usernameError", "");
    setError("passwordError", "");

    if (name.length < 2 || name.length > 12) {
      setError("usernameError", "昵称需要 2-12 位。");
      ok = false;
    }
    if (pwd.length < 6) {
      setError("passwordError", "密码至少需要 6 位。");
      ok = false;
    }
    if (ok) {
      localStorage.setItem("nailongUser", name);
      showCurrentUser();
      alert("登录成功，欢迎 " + name + "！");
      location.href = "index.html";
    }
  };
}

// 恐怖问卷
var quizQuestions = [
  {
    q: "1. 你第一次看到奶龙的时候，是什么感觉？",
    opt: ["莫名觉得亲切", "有点可爱又有点怪", "说不上来的不安", "完全无感"]
  },
  {
    q: "2. 深夜刷手机的时候，你有没有觉得奶龙的表情包在盯着你看？",
    opt: ["经常有这种错觉", "偶尔会多想", "从来没有", "越看越觉得它在笑"]
  },
  {
    q: "3. 你有没有感觉，奶龙的眼睛会跟着你的手指移动？",
    opt: ["好像真的会", "仔细看确实有点", "不可能吧", "我不敢确认"]
  },
  {
    q: "4. 半夜醒来，你觉得房间角落会不会蹲着一只奶龙？",
    opt: ["经常这么想", "偶尔会怕", "绝对不会", "希望真的有"]
  },
  {
    q: "5. 如果奶龙现在出现在你面前，你第一反应是？",
    opt: ["抱住它", "后退一步", "大声叫", "一动不动"]
  },
  {
    q: "6. 安静的时候，你有没有听到过奶龙的叫声？",
    opt: ["好像听到过", "那只是幻觉吧", "从来没有", "不想回答这个问题"]
  },
  {
    q: "7. 奶龙冲你笑的时候，你觉得那个笑容是……",
    opt: ["天真的", "意味深长的", "让人心里发毛的", "说不清楚"]
  },
  {
    q: "8. 你现在回头看看身后，确定没有奶龙吗？",
    opt: ["我不敢回头", "看了，没有", "好像有什么东西", "它一直都在"]
  },
  {
    q: "9. 你觉得奶龙一直在等着什么人吗？",
    opt: ["不知道", "可能吧", "应该不是我", "就是在等我"]
  },
  {
    q: "10. 最后一个问题——你愿意让奶龙永远记住你吗？",
    opt: ["愿意", "不太确定", "不愿意", "由不得我选吧"]
  }
];

var quizCurrent = 0;
var quizAnswers = [];
var quizTimers = [];
var quizIntervals = [];
var quizBusy = false;
var quizFloatLimit = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 720px)").matches ? 60 : 120;

function initPersonalityForm() {
  var startBtn = document.getElementById("quizStartBtn");
  if (!startBtn) return;

  quizAnswers = new Array(quizQuestions.length).fill(null);

  startBtn.onclick = function () {
    document.getElementById("quizIntro").style.display = "none";
    document.getElementById("quizBox").style.display = "grid";
    quizCurrent = 0;
    renderQuiz();
  };

  document.getElementById("quizPrev").onclick = function () {
    quizCleanEffects();
    if (quizCurrent > 0) { quizCurrent--; renderQuiz(); }
  };

  document.getElementById("quizNext").onclick = function () {
    quizCleanEffects();
    if (quizCurrent < quizQuestions.length - 1) {
      quizCurrent++;
      renderQuiz();
    } else {
      quizFinish();
    }
  };

  // 解锁表单验证
  var unlockForm = document.getElementById("unlockForm");
  if (unlockForm) {
    unlockForm.onsubmit = function (e) {
      e.preventDefault();
      var val = document.getElementById("unlockInput").value.trim();
      setError("unlockError", "");
      if (val !== "奶龙我爱你") {
        setError("unlockError", "输入不正确，再想想。");
        // 输错惩罚：短暂黑屏
        quizBlackFlash("它在看着你", 1500);
        return;
      }
      document.getElementById("quizUnlock").style.display = "none";
      quizShowResult();
    };
  }

  window.addEventListener("beforeunload", quizCleanEffects);
}

function renderQuiz() {
  var q = quizQuestions[quizCurrent];
  document.getElementById("quizProgress").textContent =
    "第 " + (quizCurrent + 1) + " 题 / 共 " + quizQuestions.length + " 题";
  document.getElementById("quizQuestion").textContent = q.q;

  var box = document.getElementById("quizOptions");
  box.innerHTML = "";

  for (var i = 0; i < q.opt.length; i++) {
    var div = document.createElement("div");
    div.className = "quiz-opt";
    div.textContent = q.opt[i];
    div.setAttribute("data-idx", i);
    if (quizAnswers[quizCurrent] === i) div.classList.add("picked");
    div.onclick = quizPick;
    box.appendChild(div);
  }

  var prev = document.getElementById("quizPrev");
  var next = document.getElementById("quizNext");
  prev.disabled = quizCurrent === 0;
  next.textContent = quizCurrent === quizQuestions.length - 1 ? "提交问卷" : "下一题";

  // 第4题停留一会儿后选项变字
  if (quizCurrent === 3) {
    quizDelayEffect(function () { quizOptionGlitch("奶龙在你身后", 2500); }, 2000);
  }
}

function quizPick() {
  var idx = parseInt(this.getAttribute("data-idx"));

  // 动画播放中仍允许切换选项，只更新选中状态不重复触发特效
  if (quizBusy) {
    quizAnswers[quizCurrent] = idx;
    var opts = document.querySelectorAll(".quiz-opt");
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove("picked");
    this.classList.add("picked");
    return;
  }

  quizAnswers[quizCurrent] = idx;

  var opts = document.querySelectorAll(".quiz-opt");
  for (var i = 0; i < opts.length; i++) {
    opts[i].classList.remove("picked");
  }
  this.classList.add("picked");

  // 第3题：选完触发黑屏打字
  if (quizCurrent === 2) {
    quizLock();
    quizTypeOnBlack(idx < 2 ? "它注意到你了 ^^" : "别装作看不见", 3);
    return;
  }

  // 第7题：选完全屏变红 + 漂浮文字
  if (quizCurrent === 6) {
    quizLock();
    quizRedFlood();
    return;
  }

  // 第8题：漂浮"在看你"
  if (quizCurrent === 7) {
    quizLock();
    quizPeepEffect();
    return;
  }

  // 第10题：不管选什么，锁死其他选项
  if (quizCurrent === 9) {
    var allOpts = document.querySelectorAll(".quiz-opt");
    for (var j = 0; j < allOpts.length; j++) {
      if (j !== idx) {
        allOpts[j].classList.add("locked");
        allOpts[j].textContent = "你没得选";
      }
    }
  }
}

// 特效播放时锁住所有交互
function quizLock() {
  quizBusy = true;
}

function quizUnlock() {
  quizBusy = false;
  document.getElementById("quizPrev").disabled = quizCurrent === 0;
  document.getElementById("quizNext").disabled = false;
}

// 清理所有特效残留
function quizCleanEffects() {
  for (var i = 0; i < quizTimers.length; i++) clearTimeout(quizTimers[i]);
  for (var k = 0; k < quizIntervals.length; k++) clearInterval(quizIntervals[k]);
  quizTimers = [];
  quizIntervals = [];
  var junk = document.querySelectorAll(".scare-mask,.scare-float,.scare-gray,.scare-flood");
  for (var j = 0; j < junk.length; j++) junk[j].remove();
  document.body.style.background = "";
  var card = document.querySelector(".quiz-card");
  if (card) card.style.opacity = "1";
  quizBusy = false;
}

// 延迟执行（会被切题时清理掉）
function quizDelayEffect(fn, ms) {
  quizTimers.push(setTimeout(function () {
    if (document.getElementById("quizBox").style.display !== "none") fn();
  }, ms));
}

// 选项文字闪变
function quizOptionGlitch(text, duration) {
  var opts = document.querySelectorAll(".quiz-opt");
  var saved = [];
  for (var i = 0; i < opts.length; i++) {
    saved.push(opts[i].textContent);
    opts[i].style.pointerEvents = "none";
  }
  // 依次变字
  for (var k = 0; k < opts.length; k++) {
    (function (el, delay) {
      quizTimers.push(setTimeout(function () { el.textContent = text; }, delay));
    })(opts[k], k * 300);
  }
  // 恢复
  quizTimers.push(setTimeout(function () {
    for (var m = 0; m < opts.length; m++) {
      opts[m].textContent = saved[m];
      opts[m].style.pointerEvents = "";
    }
  }, duration));
}

// 黑屏逐字打字
function quizTypeOnBlack(text, nextIdx) {
  var mask = document.createElement("div");
  mask.className = "scare-mask black";
  var span = document.createElement("span");
  span.className = "scare-typing";
  mask.appendChild(span);
  document.body.appendChild(mask);

  var i = 0;
  var t = setInterval(function () {
    if (i < text.length) {
      span.textContent += text[i];
      i++;
    } else {
      clearInterval(t);
      quizTimers.push(setTimeout(function () {
        var shuffle = setInterval(function () {
          span.textContent = text.split("").sort(function () {
            return Math.random() - 0.5;
          }).join("");
        }, 60);
        quizIntervals.push(shuffle);
        quizTimers.push(setTimeout(function () {
          clearInterval(shuffle);
          mask.remove();
          quizCurrent = nextIdx;
          quizUnlock();
          renderQuiz();
        }, 500));
      }, 1200));
    }
  }, 90);
  quizIntervals.push(t);
}

// 短暂黑屏闪一句话
function quizBlackFlash(text, duration) {
  var mask = document.createElement("div");
  mask.className = "scare-mask black";
  var span = document.createElement("span");
  span.className = "scare-typing";
  span.textContent = text;
  mask.appendChild(span);
  document.body.appendChild(mask);
  quizTimers.push(setTimeout(function () { mask.remove(); }, duration));
}

// 分批生成少量漂浮文字，避免一次性创建过多 DOM 节点卡住页面
function quizSpawnFloats(phrases, max, duration) {
  var total = Math.min(max, quizFloatLimit);
  var created = 0;
  var batchSize = 8;

  function spawn(initialDelay) {
    var el = document.createElement("div");
    el.className = "scare-float";
    el.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.fontSize = (12 + Math.random() * 14) + "px";
    if (initialDelay) {
      el.style.animationDelay = "-" + (Math.random() * 1.8).toFixed(2) + "s";
    }
    document.body.appendChild(el);
    el.addEventListener("animationend", function () {
      el.remove();
    });
  }

  var t = setInterval(function () {
    for (var j = 0; j < batchSize && created < total; j++) {
      spawn(created < total / 2);
      created++;
    }
    if (created >= total) clearInterval(t);
  }, 80);
  quizIntervals.push(t);

  quizTimers.push(setTimeout(function () {
    clearInterval(t);
    var floats = document.querySelectorAll(".scare-float");
    for (var i = 0; i < floats.length; i++) floats[i].remove();
    quizUnlock();
  }, duration || 2600));
}

function quizRestoreCard() {
  document.body.style.background = "";
  var card = document.querySelector(".quiz-card");
  if (card) card.style.opacity = "1";
}

function quizClearGrayOverlay() {
  var grays = document.querySelectorAll(".scare-gray");
  for (var i = 0; i < grays.length; i++) grays[i].remove();
}

function quizEndTimedEffect(duration) {
  quizTimers.push(setTimeout(function () {
    quizClearGrayOverlay();
    quizRestoreCard();
  }, duration || 2600));
}

// 全屏红 + 漂浮文字爆发
function quizRedFlood() {
  document.body.style.background = "#c00";
  var card = document.querySelector(".quiz-card");
  if (card) card.style.opacity = "0";

  var phrases = ["在看你", "别跑", "就在你后面", "嘿嘿", "奶龙", "找到你了"];
  quizSpawnFloats(phrases, 120, 2600);
  quizEndTimedEffect(2600);
}

// 满屏"在看你"飘字
function quizPeepEffect() {
  var gray = document.createElement("div");
  gray.className = "scare-gray";
  document.body.appendChild(gray);

  var words = ["在看你", "就在身边", "回头看看", "别走", "嘿", "奶龙在这里"];
  quizSpawnFloats(words, 120, 2600);
  quizEndTimedEffect(2600);
}

// 答完所有题
async function quizFinish() {
  quizCleanEffects();
  document.getElementById("quizBox").style.display = "none";

  // 黑屏填满"奶龙"
  var flood = document.createElement("div");
  flood.className = "scare-flood";
  var fill = "";
  document.body.appendChild(flood);
  flood = document.querySelector(".scare-flood");
  for (var i = 0; i < 200; i++) {
    fill += "奶龙";
    flood.textContent = fill;
    await delay(10);
  }

  quizTimers.push(setTimeout(function () {
    flood.remove();
    document.getElementById("quizUnlock").style.display = "grid";
  }, 1000));
}

// 展示结果奶龙
function quizShowResult() {
  document.getElementById("quizResult").style.display = "grid";
  var name = localStorage.getItem("nailongUser") || "陌生人";
  var group = materialGroups[Math.floor(Math.random() * 3)];
  if (group && group.files.length > 0) {
    var file = group.files[Math.floor(Math.random() * group.files.length)];
    document.getElementById("quizResultImg").src = group.folder + file;
  }
  document.getElementById("quizResultTitle").textContent = name + "，这只奶龙一直在等你";
}

// 组词页：只允许输入 1-15 个英文字母
function initWordForm() {
  var form = document.getElementById("wordForm");
  if (!form) return;

  form.onsubmit = function (e) {
    e.preventDefault();
    var val = document.getElementById("wordInput").value.trim().toUpperCase();
    setError("wordInputError", "");

    if (!val) {
      setError("wordInputError", "请输入 1-15 个英文字母。");
      return;
    }
    if (val.length > 15) {
      setError("wordInputError", "最多输入 15 个字母。");
      return;
    }
    if (!/^[A-Z]+$/.test(val)) {
      setError("wordInputError", "只能输入英文字母，不能输入中文、数字或符号。");
      return;
    }
    drawWordImage(val);
  };
}

// 把每个字母对应的奶龙图片拼到 Canvas 上，并生成下载链接
function drawWordImage(word) {
  var canvas = document.getElementById("wordCanvas");
  var download = document.getElementById("downloadWord");
  if (!canvas) return;

  if (download) {
    if (download.dataset.objectUrl) {
      URL.revokeObjectURL(download.dataset.objectUrl);
      delete download.dataset.objectUrl;
    }
    download.removeAttribute("href");
    download.removeAttribute("download");
    download.className = "btn secondary";
  }

  var paths = word.split("").map(function (c) { return BASE_URL + "/images/奶龙字母/" + c + ".jpg"; });
  // 等所有图片加载完再一起绘制
  var imgs = [], loaded = 0, failed = 0;
  paths.forEach(function (src, i) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      loaded++;
      if (loaded === paths.length) draw();
    };
    img.onerror = function () {
      failed++; loaded++;
      if (loaded === paths.length) draw();
    };
    img.src = src;
    imgs[i] = img;
  });

  function draw() {
    if (failed > 0) {
      setError("wordInputError", "有字母素材加载失败，请稍后重试。");
      return;
    }
    var ctx = canvas.getContext("2d");
    var cell = 120;
    canvas.width = imgs.length * cell;
    canvas.height = cell;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imgs.forEach(function (img, i) {
      ctx.drawImage(img, i * cell, 0, cell, cell);
    });
    try {
      canvas.toBlob(function (blob) {
        if (!blob) {
          setError("wordInputError", "图片下载地址生成失败，请重新生成。");
          return;
        }
        var url = URL.createObjectURL(blob);
        if (download) {
          download.href = url;
          download.download = "nailong-" + word + ".png";
          download.dataset.objectUrl = url;
          download.className = "btn primary";
        }
      }, "image/png");
    } catch (err) {
      setError("wordInputError", err.message);
      if (download) {
        download.removeAttribute("href");
        download.removeAttribute("download");
        download.className = "btn secondary";
      }
    }
  }
}

// 首页轮播：把随机抽到的 GIF 填入三张卡片，每 3 秒切换一次
function initSlider() {
  var cards = document.querySelectorAll(".collage-card");
  if (cards.length === 0) return;

  cards.forEach(function (card, i) {
    card.querySelector("img").src = bannerSlides[i].src;
  });

  var idx = 0;
  setInterval(function () {
    cards[idx].classList.remove("active");
    idx = (idx + 1) % cards.length;
    cards[idx].classList.add("active");
  }, 3000);
}

// 收藏页：把 localStorage 里的收藏渲染成可拖动的冰箱贴
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

  // 鼠标拖动冰箱贴，松开后保存位置
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

// 分类页：动态生成分类 tab 按钮并初始化
function initCategoryPage() {
  var grid = document.getElementById("categoryGrid");
  if (!grid) return;

  // 生成分类按钮
  var tabsEl = document.getElementById("categoryTabs");
  var html = '<button class="tab active" type="button" data-category="all">全部</button>';
  materialGroups.forEach(function (g) {
    html += '<button class="tab" type="button" data-category="' + g.category + '">' + g.categoryName + '</button>';
  });
  tabsEl.innerHTML = html;

  // 点击分类按钮时切换
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

// 把当前分类、当前页的素材渲染到网格
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

  var totalPages = Math.ceil(list.length / pageSize);
  var pageItems = list.slice((curPage - 1) * pageSize, curPage * pageSize);

  var html = "";
  pageItems.forEach(function (item) {
    html += '<article class="feature-card gallery-card" draggable="true" data-title="' + item.title + '" data-category="' + item.category + '" data-file="' + item.file + '" tabindex="0">';
    html += '<img src="' + item.image + '" alt="' + item.title + '"><h3>' + item.title + '</h3></article>';
  });
  grid.innerHTML = html;

  // 分页按钮
  var pgHtml = "";
  pgHtml += '<button type="button"' + (curPage === 1 ? " disabled" : ' data-page="' + (curPage - 1) + '"') + '>&laquo;</button>';
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

  // 点击卡片跳到详情页，双击收藏
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

// 首页和分类页的拖放收藏功能
function initDragAndDrop() {
  var dropZone = document.getElementById("dropZone");
  var favoriteList = document.getElementById("favoriteList");
  if (!dropZone) return;

  document.getElementById("clearFavorites").onclick = function () {
    localStorage.removeItem("nailongFavorites");
    localStorage.removeItem("nailongNotePositions");
    renderFavoriteList();
  };

  document.querySelectorAll(".feature-card").forEach(function (card) {
    card.ondragstart = function (e) {
      e.dataTransfer.setData("text/plain", card.dataset.title);
      e.dataTransfer.setData("text/category", card.dataset.category || "");
      e.dataTransfer.setData("text/file", card.dataset.file || "");
    };
  });

  dropZone.ondragover = function (e) { e.preventDefault(); dropZone.className = "drop-zone over"; };
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

// 把一条素材加入收藏（重复的跳过）
function addFavorite(category, file, title) {
  var image = "";
  materialGroups.forEach(function (g) {
    if (g.category === category) image = g.folder + file;
  });
  if (!image) return;

  var list = JSON.parse(localStorage.getItem("nailongFavorites") || "[]");
  var key = category + "|" + file;
  if (!list.some(function (f) { return f.key === key; })) {
    list.push({ key: key, category: category, file: file, title: title, image: image });
    localStorage.setItem("nailongFavorites", JSON.stringify(list));
  }
}

// 渲染收藏篮列表，每条有删除按钮
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
      // 同步删除位置记录
      if (removed) {
        var pos = JSON.parse(localStorage.getItem("nailongNotePositions") || "{}");
        delete pos[removed.key];
        localStorage.setItem("nailongNotePositions", JSON.stringify(pos));
      }
      renderFavoriteList();
    };
  });
}

// 大笑页：默认静音自动播放，点按钮后开声音
function initSmileVideo() {
  var video = document.getElementById("smileVideo");
  var button = document.getElementById("smilePlayButton");
  if (!video || !button) return;

  video.play().catch(function () { button.textContent = "点击播放"; });
  button.onclick = function () {
    video.muted = false;
    video.volume = 1;
    video.play();
    button.textContent = "正在大笑";
  };
}

// 浮动广告：在页面右下角飘着，可以关掉
function initFloatAd() {
  var ad = document.getElementById("floatAd");
  if (!ad) return;

  var closeBtn = document.getElementById("closeFloatAd");
  closeBtn.onclick = function () {
    ad.style.display = "none";
  };

  // 让广告上下慢慢飘动
  var baseBottom = 28;
  var direction = 1;
  var offset = 0;
  setInterval(function () {
    offset += direction * 0.4;
    if (offset > 18 || offset < -18) direction *= -1;
    ad.style.bottom = (baseBottom + offset) + "px";
  }, 50);
}

// 详情页：从 url 参数拿到素材信息，渲染大图和详情
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

  var group = null;
  for (var i = 0; i < materialGroups.length; i++) {
    if (materialGroups[i].category === category) {
      group = materialGroups[i];
      break;
    }
  }
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

  // 拼出详情卡片
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

  // 同分类里取几张推荐
  html += '<section class="panel glass"><h2>同分类推荐</h2><div class="card-grid">';
  var shuffled = group.files.slice().sort(function () { return Math.random() - 0.5; });
  var count = 0;
  for (var j = 0; j < shuffled.length && count < 3; j++) {
    if (shuffled[j] === file) continue;
    var recTitle = category === "letters" ? shuffled[j].replace(/\.\w+$/, "") : group.titlePrefix + " " + (j + 1);
    html += '<article class="feature-card" onclick="location.href=\'detail.html?category=' + category + '&file=' + encodeURIComponent(shuffled[j]) + '\'" style="cursor:pointer">';
    html += '<img src="' + group.folder + shuffled[j] + '" alt="' + recTitle + '"><h3>' + recTitle + '</h3></article>';
    count++;
  }
  html += '</div></section>';

  wrap.innerHTML = html;

  // 详情页的 canvas 画点装饰文字
  var cvs = document.getElementById("detailCanvas");
  if (cvs) {
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

  // 收藏按钮
  var favBtn = document.getElementById("detailFavBtn");
  if (favBtn) {
    favBtn.onclick = function () {
      addFavorite(category, file, title);
      favBtn.textContent = "已收藏 ✓";
      favBtn.disabled = true;
    };
  }
}
