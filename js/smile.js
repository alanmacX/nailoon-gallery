onReady(initSmileVideo);

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
