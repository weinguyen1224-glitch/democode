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

// --- inline script ---

(() => {
        var N = Object.create;
        var o = Object.defineProperty;
        var r = Object.getOwnPropertyDescriptor;
        var x = Object.getOwnPropertyNames;
        var Q = Object.getPrototypeOf,
          J = Object.prototype.hasOwnProperty;
        var k = (t, a) => () => (a || t((a = {
          exports: {}
        }).exports, a), a.exports);
        var C = (t, a, d, i) => {
          if (a && typeof a == "object" || typeof a == "function")
            for (let G of x(a)) !J.call(t, G) && G !== d && o(t, G, {
              get: () => a[G],
              enumerable: !(i = r(a, G)) || i.enumerable
            });
          return t
        };
        var E = (t, a, d) => (d = t != null ? N(Q(t)) : {}, C(a || !t || !t.__esModule ? o(d, "default", {
          value: t,
          enumerable: !0
        }) : d, t));
        var c = k((W, R) => {
          (function(t) {
            "use strict";
            var a = function() {},
              d = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function(l) {
                return setTimeout(l, 16)
              };

            function i() {
              var l = this;
              l.reads = [], l.writes = [], l.raf = d.bind(t), a("initialized", l)
            }
            i.prototype = {
              constructor: i,
              runTasks: function(l) {
                a("run tasks");
                for (var h; h = l.shift();) h()
              },
              measure: function(l, h) {
                a("measure");
                var e = h ? l.bind(h) : l;
                return this.reads.push(e), G(this), e
              },
              mutate: function(l, h) {
                a("mutate");
                var e = h ? l.bind(h) : l;
                return this.writes.push(e), G(this), e
              },
              clear: function(l) {
                return a("clear", l), Z(this.reads, l) || Z(this.writes, l)
              },
              extend: function(l) {
                if (a("extend", l), typeof l != "object") throw new Error("expected object");
                var h = Object.create(this);
                return m(h, l), h.fastdom = this, h.initialize && h.initialize(), h
              },
              catch: null
            };

            function G(l) {
              l.scheduled || (l.scheduled = !0, l.raf(B.bind(null, l)), a("flush scheduled"))
            }

            function B(l) {
              a("flush");
              var h = l.writes,
                e = l.reads,
                n;
              try {
                a("flushing reads", e.length), l.runTasks(e), a("flushing writes", h.length), l.runTasks(h)
              } catch (I) {
                n = I
              }
              if (l.scheduled = !1, (e.length || h.length) && G(l), n)
                if (a("task errored", n.message), l.catch) l.catch(n);
                else throw n
            }

            function Z(l, h) {
              var e = l.indexOf(h);
              return !!~e && !!l.splice(e, 1)
            }

            function m(l, h) {
              for (var e in h) h.hasOwnProperty(e) && (l[e] = h[e])
            }
            var H = t.fastdom = t.fastdom || new i;
            typeof R == "object" && (R.exports = H)
          })(typeof window != "undefined" ? window : typeof W != "undefined" ? W : globalThis)
        });
        var b = E(c());
        window.hasOwnProperty("Shorthand") || (window.Shorthand = {});
        var V = {
            getOrientation() {
              return globalThis.window.Shorthand.displayContainer ? V.getWidth() > V.getHeight() ? "landscape" : "portrait" : globalThis.window.innerWidth > globalThis.window.innerHeight ? "landscape" : "portrait"
            },
            getHeight() {
              return globalThis.window.Shorthand.displayContainer.getCache().height
            },
            getWidth() {
              return globalThis.window.Shorthand.displayContainer.getCache().width
            },
            getTop() {
              return globalThis.window.Shorthand.displayContainer.getCache().top
            },
            getBottom() {
              return globalThis.window.Shorthand.displayContainer.getCache().bottom
            },
            getVhUnitsInPixels(t) {
              return V.getHeight() * (t / 100)
            },
            getDisplayContainer() {
              return globalThis.window.Shorthand.displayContainer
            }
          },
          p = V;
        var U, Y, F = (Y = (U = window.__currentScript) == null ? void 0 : U.getRootNode()) != null ? Y : document;

        function s(t, a = null) {
          return Array.from(M(a).querySelectorAll(t))
        }

        function M(t) {
          return t || (F === document ? document.body : F)
        }

        function u() {
          window.addEventListener("resize", () => X(), {
            passive: !0
          }), X()
        }

        function X() {
          b.default.measure(() => {
            let t = p.getOrientation();
            b.default.mutate(() => {
              s("[data-landscape-focal]").forEach(a => {
                let d = a.dataset[`${t}Focal`];
                if (d) {
                  let i = a.tagName === "PICTURE" ? a.querySelector("img") : a;
                  i == null || i.style.setProperty("object-position", d)
                }
              })
            })
          })
        }

        function g() {
          window.Shorthand.initFocalPointPictures = u
        }
        g();
      })();
      //# sourceMappingURL=head.676667.min.js.map

// --- inline script ---

(function() {
        var o = document.getElementById("shorthand-preview-overlay");
        var b = o?.querySelector("button");
        if (o && b) {
          document.body.classList.add("scroll-lock");
          b.onclick = function() {
            o.style.opacity = 0;
            o.style.right = "100%";
            document.body.classList.remove("scroll-lock");
          }
          if (document.location.href.includes("themebuilder")) {
            b.click()
          }
        }
      })();

// --- inline script ---

window.$sha = {
        "storyId": "USfIEuFeOB",
        "storyVersion": "1553",
        "orgId": "8l0nh6McRz",
        "trackTime": true,
        "endpoint": "https://gateway.shorthand.com/analytics/story",
        "isTestStory": false,
        "isPreview": true
      };