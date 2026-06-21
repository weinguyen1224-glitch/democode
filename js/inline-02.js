(function () {
  var o = document.getElementById("shorthand-preview-overlay");
  var b = o?.querySelector("button");
  if (o && b) {
    document.body.classList.add("scroll-lock");
    b.onclick = function () {
      o.style.opacity = 0;
      o.style.right = "100%";
      document.body.classList.remove("scroll-lock");
    };
    if (document.location.href.includes("themebuilder")) {
      b.click();
    }
  }
})();
