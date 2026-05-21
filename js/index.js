onReady(async function () {
  await fetchAllMaterials();
  initSlider();
  initDragAndDrop();
  initFloatAd();
});

function initSlider() {
  var cards = document.querySelectorAll(".collage-card");
  if (cards.length === 0) return;

  var gifGroup = getMaterialGroup("gifs");
  var bannerSlides = [];
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

  cards.forEach(function (card, i) {
    if (bannerSlides[i]) card.querySelector("img").src = bannerSlides[i].src;
  });

  var idx = 0;
  setInterval(function () {
    cards[idx].classList.remove("active");
    idx = (idx + 1) % cards.length;
    cards[idx].classList.add("active");
  }, 3000);
}

function initFloatAd() {
  var ad = document.getElementById("floatAd");
  if (!ad) return;

  var closeBtn = document.getElementById("closeFloatAd");
  closeBtn.onclick = function () {
    ad.style.display = "none";
  };

  var baseBottom = 28;
  var direction = 1;
  var offset = 0;
  setInterval(function () {
    offset += direction * 0.4;
    if (offset > 18 || offset < -18) direction *= -1;
    ad.style.bottom = (baseBottom + offset) + "px";
  }, 50);
}
