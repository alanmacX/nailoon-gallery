(function () {
  if (window.NAILONG_SPLIT_LOADER_RAN) return;
  window.NAILONG_SPLIT_LOADER_RAN = true;

  var VERSION = "2.0.0";
  var path = location.pathname.split("/").pop() || "index.html";
  var pageScripts = {
    "index.html": ["favorites.js", "index.js"],
    "category.html": ["favorites.js", "category.js"],
    "detail.html": ["favorites.js", "detail.js"],
    "collection.html": ["collection.js"],
    "word.html": ["word.js"],
    "contact.html": ["contact.js"],
    "smile.html": ["smile.js"],
    "login.html": ["login.js"]
  };

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "js/" + src + "?v=" + VERSION;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  loadScript("common.js")
    .then(function () {
      var scripts = pageScripts[path] || pageScripts["index.html"];
      return scripts.reduce(function (chain, src) {
        return chain.then(function () { return loadScript(src); });
      }, Promise.resolve());
    })
    .catch(function (err) {
      console.error("页面脚本加载失败:", err);
    });
})();
