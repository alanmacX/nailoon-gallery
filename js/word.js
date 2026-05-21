onReady(initWordForm);

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

  var paths = word.split("").map(function (c) {
    return BASE_URL + "/images/奶龙字母/" + c + ".jpg?_t=" + new Date().getTime();
  });
  var imgs = [];
  var loaded = 0;
  var failed = 0;

  paths.forEach(function (src, i) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      loaded++;
      if (loaded === paths.length) draw();
    };
    img.onerror = function () {
      failed++;
      loaded++;
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
      var dataUrl = canvas.toDataURL("image/png");
      if (download) {
        download.href = dataUrl;
        download.download = "nailong-" + word + ".png";
        download.className = "btn primary";
      }
    } catch (err) {
      console.error(err);
      setError("wordInputError", "由于跨域策略受限，无法直接下载(" + err.message + ")。您可以尝试右键点击上方图片选择“另存为”。");
      if (download) {
        download.removeAttribute("href");
        download.removeAttribute("download");
        download.className = "btn secondary";
      }
    }
  }
}
