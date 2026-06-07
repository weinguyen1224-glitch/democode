window.addEventListener("message", event => {
        if (event.data.type !== "theme-preview") return;

        document.querySelector("body").style.pointerEvents = "none";

        var style = document.querySelector(".Theme-Styles-Custom");
        if (!style) {
          style = document.createElement("style");
          style.className = "Theme-Styles-Custom";
          document.head.appendChild(style);
        }
        style.textContent = event.data.style;

        var bigLogo = document.querySelector(".Theme-BigLogo");
        if (bigLogo && event.data.bigLogo) {
          bigLogo.src = event.data.bigLogo;
          bigLogo.alt = event.data.logoAlt;
        }
        var smallLogo = document.querySelector(".Theme-SmallLogo");
        if (smallLogo && event.data.smallLogo) {
          smallLogo.src = event.data.smallLogo;
          smallLogo.alt = event.data.logoAlt;
        }
        if (event.data.logoHref && bigLogo.parentElement.tagName === "A") {
          bigLogo.parentElement.href = event.data.logoHref;
        }

        document.querySelectorAll("sh-model").forEach(model => model.onLoadCallback && model.onLoadCallback());

        var footer = document.querySelector(".PreviewFooter");
        if (footer) footer.remove();
      })
