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

onReady(async function () {
  await fetchAllMaterials();
  initPersonalityForm();
});

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
    if (quizCurrent > 0) {
      quizCurrent--;
      renderQuiz();
    }
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

  var unlockForm = document.getElementById("unlockForm");
  if (unlockForm) {
    unlockForm.onsubmit = function (e) {
      e.preventDefault();
      var val = document.getElementById("unlockInput").value.trim();
      setError("unlockError", "");
      if (val !== "奶龙我爱你") {
        setError("unlockError", "输入不正确，再想想。");
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

  if (quizCurrent === 3) {
    quizDelayEffect(function () { quizOptionGlitch("奶龙在你身后", 2500); }, 2000);
  }
}

function quizPick() {
  var idx = parseInt(this.getAttribute("data-idx"));

  if (quizBusy) {
    quizAnswers[quizCurrent] = idx;
    var busyOpts = document.querySelectorAll(".quiz-opt");
    for (var i = 0; i < busyOpts.length; i++) busyOpts[i].classList.remove("picked");
    this.classList.add("picked");
    return;
  }

  quizAnswers[quizCurrent] = idx;

  var opts = document.querySelectorAll(".quiz-opt");
  for (var j = 0; j < opts.length; j++) opts[j].classList.remove("picked");
  this.classList.add("picked");

  if (quizCurrent === 2) {
    quizLock();
    quizTypeOnBlack(idx < 2 ? "它注意到你了 ^^" : "别装作看不见", 3);
    return;
  }

  if (quizCurrent === 6) {
    quizLock();
    quizRedFlood();
    return;
  }

  if (quizCurrent === 7) {
    quizLock();
    quizPeepEffect();
    return;
  }

  if (quizCurrent === 9) {
    var allOpts = document.querySelectorAll(".quiz-opt");
    for (var k = 0; k < allOpts.length; k++) {
      if (k !== idx) {
        allOpts[k].classList.add("locked");
        allOpts[k].textContent = "你没得选";
      }
    }
  }
}

function quizLock() {
  quizBusy = true;
}

function quizUnlock() {
  quizBusy = false;
  document.getElementById("quizPrev").disabled = quizCurrent === 0;
  document.getElementById("quizNext").disabled = false;
}

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

function quizDelayEffect(fn, ms) {
  quizTimers.push(setTimeout(function () {
    if (document.getElementById("quizBox").style.display !== "none") fn();
  }, ms));
}

function quizOptionGlitch(text, duration) {
  var opts = document.querySelectorAll(".quiz-opt");
  var saved = [];
  for (var i = 0; i < opts.length; i++) {
    saved.push(opts[i].textContent);
    opts[i].style.pointerEvents = "none";
  }
  for (var k = 0; k < opts.length; k++) {
    (function (el, delay) {
      quizTimers.push(setTimeout(function () { el.textContent = text; }, delay));
    })(opts[k], k * 300);
  }
  quizTimers.push(setTimeout(function () {
    for (var m = 0; m < opts.length; m++) {
      opts[m].textContent = saved[m];
      opts[m].style.pointerEvents = "";
    }
  }, duration));
}

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

function quizRedFlood() {
  document.body.style.background = "#c00";
  var card = document.querySelector(".quiz-card");
  if (card) card.style.opacity = "0";

  quizSpawnFloats(["在看你", "别跑", "就在你后面", "嘿嘿", "奶龙", "找到你了"], 120, 2600);
  quizEndTimedEffect(2600);
}

function quizPeepEffect() {
  var gray = document.createElement("div");
  gray.className = "scare-gray";
  document.body.appendChild(gray);

  quizSpawnFloats(["在看你", "就在身边", "回头看看", "别走", "嘿", "奶龙在这里"], 120, 2600);
  quizEndTimedEffect(2600);
}

async function quizFinish() {
  quizCleanEffects();
  document.getElementById("quizBox").style.display = "none";

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

function quizShowResult() {
  document.getElementById("quizResult").style.display = "grid";
  var name = localStorage.getItem("nailongUser") || "陌生人";
  var groups = materialGroups.slice(0, 3);
  var group = groups[Math.floor(Math.random() * groups.length)];
  if (group && group.files.length > 0) {
    var file = group.files[Math.floor(Math.random() * group.files.length)];
    document.getElementById("quizResultImg").src = group.folder + file;
  }
  document.getElementById("quizResultTitle").textContent = name + "，这只奶龙一直在等你";
}
