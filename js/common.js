function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

var BASE_URL = "https://image.hakimi.uno";

var materialConfig = [
  { category: "nai", name: "奶", prefix: "奶龙素材", path: "/images/photos/奶/" },
  { category: "naiguo", name: "奶果", prefix: "奶果素材", path: "/images/photos/奶果/" },
  { category: "naiqi", name: "奶气", prefix: "奶气素材", path: "/images/photos/奶气/" },
  { category: "gifs", name: "动态表情", prefix: "动态表情", path: "/images/gifs/" },
  { category: "letters", name: "奶龙字母", prefix: "字母素材", path: "/images/奶龙字母/" },
  { category: "stickers", name: "表情包", prefix: "表情包", path: "/images/表情包/" }
];

var materialGroups = [];
var materialLoadPromise = null;

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

function showCurrentUser() {
  var name = localStorage.getItem("nailongUser") || "游客";
  document.querySelectorAll("#currentUser").forEach(function (el) {
    el.textContent = name;
  });
}

function setError(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg;
}

async function fetchAllMaterials() {
  if (materialGroups.length > 0) return materialGroups;
  if (materialLoadPromise) return materialLoadPromise;

  materialLoadPromise = Promise.all(materialConfig.map(async function (cfg) {
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
  })).then(function (groups) {
    materialGroups = groups;
    return materialGroups;
  }).catch(function (e) {
    console.error("素材加载失败:", e);
    materialLoadPromise = null;
    return [];
  });

  return materialLoadPromise;
}

function getMaterialGroup(category) {
  for (var i = 0; i < materialGroups.length; i++) {
    if (materialGroups[i].category === category) return materialGroups[i];
  }
  return null;
}

onReady(showCurrentUser);
