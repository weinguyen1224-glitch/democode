import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

(function () {
  "use strict";

  var section = document.querySelector(".ch4-3d-viewer");
  if (!section) {
    console.warn("[3D] section not found");
    return;
  }

  var container = document.getElementById("ch4-3d-canvas");
  var overlay = document.getElementById("ch4-3d-overlay");
  var selectEl = document.getElementById("ch4-3d-select");
  var fitBtn = document.getElementById("ch4-3d-fit");
  var spinBtn = document.getElementById("ch4-3d-spin");

  if (!container) {
    console.warn("[3D] canvas container not found");
    return;
  }

  var MODELS = [
    {
      name: "Hộp bánh + trà + đĩa",
      url: "preview-3d/Meshy_AI_Banh_Phu_The_Scene_3D_0613062416_image-to-3d-texture.glb",
    },
    {
      name: "Nguyên hộp bánh",
      url: "preview-3d/Meshy_AI_Bánh_Phu_Thê_Minh_T_0613050153_texture.glb",
    },
  ];

  var renderer, scene, camera, controls, current;
  var spin = false,
    raf = null,
    initialized = false;

  /* ── Lấy size thật của container ──────────────────────────── */
  function getSize() {
    var w = container.offsetWidth || container.parentElement.offsetWidth || 390;
    var h =
      container.offsetHeight || container.parentElement.offsetHeight || 500;
    return { w: w, h: h };
  }

  function init() {
    if (initialized) return;
    initialized = true;
    console.log("[3D] init()");

    /* ── Renderer ──────────────────────────────────────────── */
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    // ✅ KHÔNG set pixelRatio hay size ở đây — onResize() lo hết
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    /* ── Scene ─────────────────────────────────────────────── */
    scene = new THREE.Scene();

    /* ── Camera — dùng getSize() thay vì clientWidth ────────── */
    var s = getSize();
    camera = new THREE.PerspectiveCamera(40, s.w / s.h, 0.01, 5000);
    camera.position.set(3, 2, 4);

    /* ── Controls ──────────────────────────────────────────── */
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1;
    controls.maxDistance = 50;

    /* ── Lighting ──────────────────────────────────────────── */
    scene.add(new THREE.HemisphereLight(0xfff5e6, 0x2a1520, 2.2));

    var key = new THREE.DirectionalLight(0xfff8ef, 2.6);
    key.position.set(4, 7, 5);
    scene.add(key);

    var rim = new THREE.DirectionalLight(0xf8d077, 1.2);
    rim.position.set(-5, 3, -4);
    scene.add(rim);

    var fill = new THREE.DirectionalLight(0xffe0c0, 0.6);
    fill.position.set(-2, -1, 3);
    scene.add(fill);

    /* ── Floor grid ────────────────────────────────────────── */
    var grid = new THREE.GridHelper(12, 24, 0x8b3040, 0x4a1520);
    grid.material.transparent = true;
    grid.material.opacity = 0.25;
    scene.add(grid);

    /* ── Events ────────────────────────────────────────────── */
    if (fitBtn) fitBtn.addEventListener("click", fit);
    if (spinBtn) spinBtn.addEventListener("click", toggleSpin);
    if (selectEl)
      selectEl.addEventListener("change", function () {
        var idx = parseInt(selectEl.value, 10);
        loadModel(MODELS[idx].url, MODELS[idx].name);
      });

    window.addEventListener("resize", onResize);

    // ✅ Đợi 1 frame để container có kích thước thật trong DOM
    requestAnimationFrame(function () {
      onResize();
      loadModel(MODELS[0].url, MODELS[0].name);
      animate();
    });
  }

  /* ── onResize — source of truth cho canvas size ─────────── */
  function onResize() {
    if (!renderer || !camera) return;
    var s = getSize();
    if (s.w === 0 || s.h === 0) return;

    var dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);

    // ✅ setSize(w, h, true) — Three.js tự set CSS = w×h px
    //    canvas attribute tự = w*dpr × h*dpr  → sắc nét Retina
    renderer.setSize(s.w, s.h, true);

    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
  }

  /* ── Lazy init ───────────────────────────────────────────── */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.disconnect();
          init();
        }
      });
    },
    { rootMargin: "200px" },
  );
  observer.observe(section);

  /* ── Model loading ───────────────────────────────────────── */
  function loadModel(url, name) {
    if (!renderer) return;
    showLoading();
    clearCurrent();

    var loader = new GLTFLoader();
    loader.load(
      url,
      function (gltf) {
        hideLoading();
        current = gltf.scene || gltf;
        scene.add(current);
        current.traverse(function (o) {
          if (o.isMesh) {
            o.castShadow = o.receiveShadow = true;
            if (o.material) o.material.needsUpdate = true;
          }
        });
        fit();
      },
      function (progress) {
        if (progress.total) {
          var pct = Math.round((progress.loaded / progress.total) * 100);
          var el = overlay ? overlay.querySelector("span") : null;
          if (el) el.textContent = "Đang tải " + pct + "%…";
        }
      },
      function (err) {
        console.error("[3D] load error:", url, err);
        hideLoading();
        var el = overlay ? overlay.querySelector("span") : null;
        if (el) el.textContent = "Lỗi tải mô hình. Mở Console để xem chi tiết.";
      },
    );
  }

  /* ── Camera fit ──────────────────────────────────────────── */
  function fit() {
    if (!current) return;
    var box = new THREE.Box3().setFromObject(current);
    var size = box.getSize(new THREE.Vector3());
    var center = box.getCenter(new THREE.Vector3());

    current.position.sub(center);

    var max = Math.max(size.x, size.y, size.z) || 1;
    var dist = max * 2.25;
    camera.position.set(dist, dist * 0.62, dist);
    camera.near = max / 200;
    camera.far = max * 200;
    camera.updateProjectionMatrix();

    controls.target.set(0, 0, 0);
    controls.update();

    var grid = scene.children.find(function (c) {
      return c.isGridHelper;
    });
    if (grid) grid.scale.setScalar(Math.max(1, max / 2));
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function clearCurrent() {
    if (!current) return;
    scene.remove(current);
    current.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      var mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.filter(Boolean).forEach(function (m) {
        if (m.dispose) m.dispose();
      });
    });
    current = null;
  }

  function toggleSpin() {
    spin = !spin;
    if (spinBtn) {
      spinBtn.textContent = spin ? "Dừng xoay" : "Auto xoay";
      spinBtn.classList.toggle("ch4-3d-viewer__btn--active", spin);
    }
  }

  function showLoading() {
    if (overlay) overlay.style.opacity = "1";
  }
  function hideLoading() {
    if (overlay) overlay.style.opacity = "0";
  }

  /* ── Render loop ─────────────────────────────────────────── */
  function animate() {
    raf = requestAnimationFrame(animate);
    if (current && spin) current.rotation.y += 0.004;
    if (controls) controls.update();
    if (renderer) renderer.render(scene, camera);
  }
})();
