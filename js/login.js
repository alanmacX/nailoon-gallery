onReady(initLoginForm);

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
