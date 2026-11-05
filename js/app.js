document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // 1. BLACK & WHITE / LIQUID GLASS THEME ENGINE
  window.applyKeystoneTheme = function(theme) {
    const html = document.documentElement;
    html.classList.remove('light', 'dark', 'theme-frosted-glass');

    if (theme === 'light' || theme === 'white' || theme === 'theme-frosted-glass') {
      html.classList.add('light', 'theme-frosted-glass');
      localStorage.setItem('keystone-theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('keystone-theme', 'dark');
    }
  };

  window.toggleKeystoneTheme = function() {
    const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    window.applyKeystoneTheme(newTheme);
    return newTheme;
  };

  const savedTheme = localStorage.getItem('keystone-theme') || 'dark';
  window.applyKeystoneTheme(savedTheme);

  // 2. THREE.JS 3D ENGINE (4 HIGH-END ARCHITECTURAL MODELS MATCHING USER PHOTOS)
  function init3DHouseViewer() {
    const canvas = document.getElementById('popOut3dCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth || 600;
    const height = parent.clientHeight || 520;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(16, 12, 20);
    camera.lookAt(0, 3.5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Architectural Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3d6, 1.7);
    sunLight.position.set(18, 28, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Warm Interior Room Lights
    const interiorLight = new THREE.PointLight(0xffaa44, 3.0, 16);
    interiorLight.position.set(0, 3.5, 0);
    scene.add(interiorLight);

    // Materials
    let currentWallColor = 0xf5e6d3; // Default warm cream/beige from Photo 1
    const wallMat = new THREE.MeshStandardMaterial({ color: currentWallColor, roughness: 0.35, metalness: 0.05 });
    const marbleDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.3 });
    const blueFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.4 });
    const woodTeakMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 });
    const pergolaWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 });
    const metalRailingMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.6 });
    const glassCurtainMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, roughness: 0.02, transmission: 0.92, reflectivity: 0.95 });
    const poolWaterMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8, roughness: 0.05, transmission: 0.85, reflectivity: 0.95 });
    const stairGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 });
    const lawnGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

    window.change3DHouseColor = function(colorHex) {
      currentWallColor = parseInt(colorHex.replace('#', '0x'));
      wallMat.color.setHex(currentWallColor);
      pergolaWhiteMat.color.setHex(currentWallColor);
    };

    let currentModelGroup = new THREE.Group();
    scene.add(currentModelGroup);

    let floor1Mesh = null;
    let floor2Mesh = null;
    let roofMesh = null;

    const modelsData = [
      {
        title: '01 / BEIGE MARBLE PERGOLA VILLA',
        desc: 'Matches Photo 1 · Dark Marble Columns & Roof Pergola Lattice',
        builder: buildModelPhoto1
      },
      {
        title: '02 / STEEL-BLUE GLASS VILLA',
        desc: 'Matches Photo 2 · 3-Story Double-Height Atrium & Floating Stairs',
        builder: buildModelPhoto2
      },
      {
        title: '03 / INFINITY POOL RESORT',
        desc: 'Matches Photo 3 & 4 · Turquoise Swimming Pool & Teak Overhangs',
        builder: buildModelPhoto3
      },
      {
        title: '04 / CUBIC MODERN ESTATE',
        desc: 'Matches Photo 5 · 3-Story Modern Residence & Balcony Terrace',
        builder: buildModelPhoto5
      }
    ];

    let currentModelIndex = 0;

    function loadModel(index) {
      scene.remove(currentModelGroup);
      currentModelGroup = new THREE.Group();
      scene.add(currentModelGroup);

      floor1Mesh = null;
      floor2Mesh = null;
      roofMesh = null;

      const m = modelsData[index];
      const titleElem = document.getElementById('active3dModelTitle');
      const descElem = document.getElementById('active3dModelDesc');
      const indexIndicator = document.getElementById('modelIndexIndicator');

      if (titleElem) titleElem.textContent = m.title;
      if (descElem) descElem.textContent = m.desc;
      if (indexIndicator) indexIndicator.textContent = `MODEL ${index + 1} OF 4`;

      m.builder(currentModelGroup);
    }

    function buildModelPhoto1(group) {
      floor1Mesh = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.2, 7.5), wallMat);
      floor1Mesh.position.set(0, 1.6, 0); floor1Mesh.castShadow = true; floor1Mesh.receiveShadow = true;
      group.add(floor1Mesh);

      floor2Mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 3.0, 7.0), wallMat);
      floor2Mesh.position.set(0, 4.7, 0); floor2Mesh.castShadow = true; floor2Mesh.receiveShadow = true;
      group.add(floor2Mesh);

      const col1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.4, 0.65), marbleDarkMat);
      col1.position.set(-2.4, 3.2, 3.6); col1.castShadow = true; group.add(col1);

      const col2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.4, 0.65), marbleDarkMat);
      col2.position.set(2.4, 3.2, 3.6); col2.castShadow = true; group.add(col2);

      roofMesh = new THREE.Group();
      roofMesh.position.set(0, 6.4, 0);
      for (let i = -3.6; i <= 3.6; i += 1.2) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 4.2), pergolaWhiteMat);
        beam.position.set(i, 0.2, 0); beam.castShadow = true; roofMesh.add(beam);
      }
      group.add(roofMesh);

      const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 0.12), woodTeakMat);
      door.position.set(0, 1.2, 3.76); group.add(door);

      const railing = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 0.08), metalRailingMat);
      railing.position.set(0, 3.6, 3.6); group.add(railing);

      const planter1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), lawnGreenMat);
      planter1.position.set(-3.8, 0.3, 3.8); group.add(planter1);

      const planter2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), lawnGreenMat);
      planter2.position.set(3.8, 0.3, 3.8); group.add(planter2);
    }

    function buildModelPhoto2(group) {
      floor1Mesh = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.4, 7.5), wallMat);
      floor1Mesh.position.set(0, 1.7, 0); group.add(floor1Mesh);

      floor2Mesh = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.2, 7.0), blueFrameMat);
      floor2Mesh.position.set(0.5, 5.0, 0); group.add(floor2Mesh);

      roofMesh = new THREE.Mesh(new THREE.BoxGeometry(9.5, 2.8, 6.5), wallMat);
      roofMesh.position.set(1.0, 8.0, 0); group.add(roofMesh);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(4.8, 8.0, 3.8), glassCurtainMat);
      glass.position.set(-2.6, 4.3, 2.2); group.add(glass);

      for (let i = 0; i < 7; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.45), stairGoldMat);
        step.position.set(-2.6 + i * 0.22, 1.0 + i * 0.65, 1.6); group.add(step);
      }
    }

    function buildModelPhoto3(group) {
      floor1Mesh = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.2, 8.5), wallMat);
      floor1Mesh.position.set(-0.5, 1.6, -1); group.add(floor1Mesh);

      floor2Mesh = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.0, 7.5), wallMat);
      floor2Mesh.position.set(0, 4.7, -0.5); group.add(floor2Mesh);

      const woodCeiling = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.22, 8.0), woodTeakMat);
      woodCeiling.position.set(0, 3.1, -0.5); group.add(woodCeiling);

      const pool = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.35, 5.0), poolWaterMat);
      pool.position.set(1.2, 0.18, 3.8); group.add(pool);

      const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.1, 6.5), woodTeakMat);
      poolDeck.position.set(1.2, 0.05, 3.8); group.add(poolDeck);
    }

    function buildModelPhoto5(group) {
      floor1Mesh = new THREE.Mesh(new THREE.BoxGeometry(9.5, 3.4, 8.5), wallMat);
      floor1Mesh.position.set(0, 1.7, 0); group.add(floor1Mesh);

      floor2Mesh = new THREE.Mesh(new THREE.BoxGeometry(9.0, 3.2, 8.0), wallMat);
      floor2Mesh.position.set(0, 5.0, 0); group.add(floor2Mesh);

      roofMesh = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.8, 7.0), wallMat);
      roofMesh.position.set(0, 8.0, 0); group.add(roofMesh);

      const lawn = new THREE.Mesh(new THREE.BoxGeometry(16, 0.1, 15), lawnGreenMat);
      lawn.position.set(0, 0.05, 0); group.add(lawn);
    }

    loadModel(0);

    const prevBtn = document.getElementById('prev3dModelBtn');
    const nextBtn = document.getElementById('next3dModelBtn');

    if (prevBtn) {
      prevBtn.onclick = () => {
        currentModelIndex = (currentModelIndex - 1 + modelsData.length) % modelsData.length;
        loadModel(currentModelIndex);
      };
    }
    if (nextBtn) {
      nextBtn.onclick = () => {
        currentModelIndex = (currentModelIndex + 1) % modelsData.length;
        loadModel(currentModelIndex);
      };
    }

    let isNight = false;
    let isWireframe = false;
    let isExploded = false;

    const nightBtn = document.getElementById('toggle3DNight');
    const wireframeBtn = document.getElementById('toggle3DWireframe');
    const explodeBtn = document.getElementById('toggle3DExplode');

    if (nightBtn) {
      nightBtn.onclick = () => {
        isNight = !isNight;
        sunLight.intensity = isNight ? 0.2 : 1.7;
        ambientLight.intensity = isNight ? 0.35 : 0.95;
        interiorLight.intensity = isNight ? 8 : 3.0;
      };
    }

    if (wireframeBtn) {
      wireframeBtn.onclick = () => {
        isWireframe = !isWireframe;
        [wallMat, marbleDarkMat, blueFrameMat, woodTeakMat, pergolaWhiteMat].forEach(m => m.wireframe = isWireframe);
      };
    }

    if (explodeBtn) {
      explodeBtn.onclick = () => {
        isExploded = !isExploded;
      };
    }

    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0.6;

    parent.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => isDragging = false);

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.007;
        prevMouseX = e.clientX;
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      if (!isDragging) {
        targetRotationY += 0.0025;
      }
      currentModelGroup.rotation.y += (targetRotationY - currentModelGroup.rotation.y) * 0.08;

      if (floor2Mesh && roofMesh) {
        const targetF2Y = isExploded ? 7.0 : 4.7;
        const targetRoofY = isExploded ? 11.0 : 6.4;

        floor2Mesh.position.y += (targetF2Y - floor2Mesh.position.y) * 0.08;
        roofMesh.position.y += (targetRoofY - roofMesh.position.y) * 0.08;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  // 3. LIVE TOWER BUILD SIMULATOR ENGINE (WITH SURROUNDING 3D CITY & ENDLESS AUTO-BUILD LOOP)
  function initLiveTowerBuilder() {
    const cvs = document.getElementById('c2');
    if (!cvs || typeof THREE === 'undefined') return;

    const parent = cvs.parentElement;
    const renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, parent.clientWidth / parent.clientHeight, 0.1, 500);

    const fit = () => {
      if (!parent.clientWidth || !parent.clientHeight) return;
      renderer.setSize(parent.clientWidth, parent.clientHeight, false);
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', fit);
    fit();

    // Lighting
    const sun = new THREE.DirectionalLight(0xffd2a0, 2.4);
    sun.position.set(-16, 14, 12);
    sun.castShadow = true;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x8aa0c0, 0x2a2018, 0.65));

    // Materials
    const concMat = new THREE.MeshStandardMaterial({ color: 0x9d9c96, roughness: 0.8 });
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.5 });
    const rustMat = new THREE.MeshStandardMaterial({ color: 0x6a3a22, roughness: 0.8 });
    const glassWinMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.9 });

    // Ground Base
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMesh = new THREE.Mesh(groundGeo, new THREE.MeshStandardMaterial({ color: 0x12141a, roughness: 0.95 }));
    groundMesh.position.y = -0.1;
    scene.add(groundMesh);

    // ========================================================
    // BUILD SURROUNDING 3D CITY METROPOLIS (VILLAS, TOWERS, ROADS, TREES)
    // ========================================================
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const cityGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, transmission: 0.85 });
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x242730, roughness: 0.9 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.8 });
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const streetLightMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 });

    // 1. Paved Road System with Lane Markings
    const roadX = new THREE.Mesh(new THREE.BoxGeometry(220, 0.05, 14), roadMat);
    roadX.position.set(0, 0.02, -22);
    cityGroup.add(roadX);

    const roadZ = new THREE.Mesh(new THREE.BoxGeometry(14, 0.05, 220), roadMat);
    roadZ.position.set(-22, 0.02, 0);
    cityGroup.add(roadZ);

    for (let r = -90; r <= 90; r += 18) {
      const lineX = new THREE.Mesh(new THREE.BoxGeometry(8, 0.06, 0.4), lineMat);
      lineX.position.set(r, 0.03, -22);
      cityGroup.add(lineX);

      const lineZ = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.06, 8), lineMat);
      lineZ.position.set(-22, 0.03, r);
      cityGroup.add(lineZ);
    }

    // 2. Surrounding 3D Developmental City Buildings & Modern Villas
    const bData = [
      { x: -38, z: -38, w: 16, h: 26, d: 16, col: 0x1e293b, speed: 0.85, floors: 10 },
      { x: 38, z: -38, w: 18, h: 32, d: 18, col: 0x334155, speed: 0.70, floors: 12 },
      { x: -38, z: 38, w: 20, h: 22, d: 16, col: 0x111827, speed: 0.90, floors: 8 },
      { x: 38, z: 38, w: 16, h: 40, d: 16, col: 0x1e3a8a, speed: 0.65, floors: 14 },
      { x: 0, z: -50, w: 26, h: 18, d: 14, col: 0x3f3f46, speed: 1.10, floors: 6 },
      { x: 50, z: 0, w: 16, h: 48, d: 16, col: 0x0f172a, speed: 0.80, floors: 16 },
      { x: -50, z: 0, w: 18, h: 30, d: 18, col: 0x18181b, speed: 0.95, floors: 11 }
    ];

    const cityDevBuildings = [];

    bData.forEach(b => {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);
      cityGroup.add(bGroup);

      // Foundation Pad
      const padMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.8 });
      const foundation = new THREE.Mesh(new THREE.BoxGeometry(b.w + 2, 0.3, b.d + 2), padMat);
      foundation.position.y = 0.15;
      bGroup.add(foundation);

      // Concrete Core & Floors Array
      const floorHeight = b.h / b.floors;
      const bFloors = [];

      for (let fIdx = 0; fIdx < b.floors; fIdx++) {
        const fGroup = new THREE.Group();
        fGroup.position.y = fIdx * floorHeight + 0.3;
        bGroup.add(fGroup);

        // Floor Concrete Slab
        const slab = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.15, b.d), concMat);
        slab.position.y = 0.075;
        fGroup.add(slab);

        // Corner Concrete Columns
        for (const cx of [-b.w / 2.3, b.w / 2.3]) {
          for (const cz of [-b.d / 2.3, b.d / 2.3]) {
            const col = new THREE.Mesh(new THREE.BoxGeometry(0.35, floorHeight - 0.15, 0.35), concMat);
            col.position.set(cx, (floorHeight - 0.15) / 2 + 0.15, cz);
            fGroup.add(col);
          }
        }

        // Glass Curtain Facade Wall
        const glass = new THREE.Mesh(new THREE.BoxGeometry(b.w * 0.94, floorHeight - 0.15, b.d * 0.94), cityGlassMat);
        glass.position.y = (floorHeight - 0.15) / 2 + 0.15;
        fGroup.add(glass);

        // Rebar Extensions on active floor
        const rebarGroup = new THREE.Group();
        fGroup.add(rebarGroup);
        for (const cx of [-b.w / 2.3, b.w / 2.3]) {
          for (const cz of [-b.d / 2.3, b.d / 2.3]) {
            const rebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), rustMat);
            rebar.position.set(cx, floorHeight + 0.3, cz);
            rebarGroup.add(rebar);
          }
        }

        fGroup.scale.y = 0.001;
        fGroup.visible = false;
        bFloors.push({ group: fGroup, glass: glass, rebar: rebarGroup });
      }

      // Top Mini Construction Crane
      const miniCrane = new THREE.Group();
      miniCrane.position.set(b.w / 3.5, 0, b.d / 3.5);
      const mMast = new THREE.Mesh(new THREE.BoxGeometry(0.5, b.h + 3, 0.5), craneMat);
      mMast.position.y = (b.h + 3) / 2;
      miniCrane.add(mMast);

      const mJib = new THREE.Mesh(new THREE.BoxGeometry(7, 0.3, 0.3), craneMat);
      mJib.position.set(-1.5, b.h + 3, 0);
      miniCrane.add(mJib);

      bGroup.add(miniCrane);

      cityDevBuildings.push({
        floors: bFloors,
        totalFloors: b.floors,
        speed: b.speed,
        miniCrane: miniCrane
      });
    });

    // 3. Green City Park Plots & 3D Trees
    const parkLocations = [
      { x: 20, z: -22 }, { x: -20, z: 22 }, { x: 24, z: 24 }, { x: -24, z: -24 }
    ];

    parkLocations.forEach(p => {
      const parkPad = new THREE.Mesh(new THREE.BoxGeometry(14, 0.1, 14), grassMat);
      parkPad.position.set(p.x, 0.05, p.z);
      cityGroup.add(parkPad);

      for (let t = 0; t < 3; t++) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.8, 6), treeTrunkMat);
        trunk.position.y = 0.9;
        tree.add(trunk);

        const top = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4), treeFoliageMat);
        top.position.y = 2.2;
        tree.add(top);

        tree.position.set(p.x + (t % 2 === 0 ? 3.5 : -3.5), 0.05, p.z + (t > 0 ? 3.5 : -3.5));
        cityGroup.add(tree);
      }
    });

    // 4. Streetlights with Glowing Tips
    for (let s = -60; s <= 60; s += 24) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 6), streetLightMat);
      pole.position.set(s, 1.9, -14);
      cityGroup.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), streetLightMat);
      bulb.position.set(s, 3.8, -14);
      cityGroup.add(bulb);
    }

    // ========================================================
    // MAIN LIVE 24-STORY BUILD TOWER
    // ========================================================
    const FL = 24, fh = 0.72;
    const fl = [];
    const tw = new THREE.Group();
    tw.position.y = 0.2;
    scene.add(tw);

    const padGeo = new THREE.BoxGeometry(13, 0.2, 13);
    const pad = new THREE.Mesh(padGeo, concMat);
    pad.position.y = 0.1;
    scene.add(pad);

    for (let i = 0; i < FL; i++) {
      const f = new THREE.Group();
      f.position.y = i * fh;
      tw.add(f);
      const my = 0.12 + (fh - 0.12) / 2;

      const slab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.12, 4.4), concMat);
      slab.position.set(0, 0.06, 0); f.add(slab);

      for (const x of [-1.95, 1.95]) {
        for (const z of [-1.95, 1.95]) {
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.24, fh - 0.12, 0.24), concMat);
          col.position.set(x, my, z); f.add(col);
        }
      }

      f.glass = new THREE.Mesh(new THREE.BoxGeometry(3.9, fh - 0.12, 3.9), glassWinMat);
      f.glass.position.set(0, my, 0); f.add(f.glass);

      f.rb = new THREE.Group();
      f.add(f.rb);
      for (const x of [-1.95, 1.95]) {
        for (const z of [-1.95, 1.95]) {
          const rebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), rustMat);
          rebar.position.set(x, fh + 0.3, z); f.rb.add(rebar);
        }
      }

      f.scale.y = 0.001;
      f.visible = false;
      fl.push(f);
    }

    const core = new THREE.Mesh(new THREE.BoxGeometry(1.5, FL * fh, 1.5), concMat);
    core.position.set(0, (FL * fh) / 2, 0);
    core.scale.y = 0.001;
    tw.add(core);

    const CH = FL * fh + 3.4;
    const cr = new THREE.Group();
    cr.position.set(4.6, 0, 4.6);
    tw.add(cr);

    const craneTower = new THREE.Mesh(new THREE.BoxGeometry(0.8, CH, 0.8), craneMat);
    craneTower.position.y = CH / 2;
    cr.add(craneTower);

    const jib = new THREE.Group();
    jib.position.y = CH;
    cr.add(jib);

    const jibArm = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 0.5), craneMat);
    jibArm.position.x = -2.5;
    jib.add(jibArm);

    const sl = document.getElementById('sl');
    const flb = document.getElementById('fl');
    const pcb = document.getElementById('pc');
    const toggleLoopBtn = document.getElementById('toggleAutoBuildBtn');
    const autoStatusText = document.getElementById('autoBuildStatusText');

    let ry = 0.7, rx = 0, drag = false, lx = 0, ly = 0, p = 0, auto = true;

    if (toggleLoopBtn) {
      toggleLoopBtn.onclick = () => {
        auto = !auto;
        if (autoStatusText) {
          autoStatusText.textContent = auto ? 'LOOP ACTIVE' : 'LOOP PAUSED';
        }
        toggleLoopBtn.classList.toggle('border-emerald-400', auto);
      };
    }

    cvs.addEventListener('pointerdown', (e) => {
      drag = true;
      lx = e.clientX;
      ly = e.clientY;
      cvs.setPointerCapture(e.pointerId);
    });

    cvs.addEventListener('pointerup', () => drag = false);

    cvs.addEventListener('pointermove', (e) => {
      if (drag) {
        ry -= (e.clientX - lx) * 0.008;
        rx = Math.max(-0.2, Math.min(0.5, rx + (e.clientY - ly) * 0.004));
        lx = e.clientX;
        ly = e.clientY;
      }
    });

    if (sl) {
      sl.addEventListener('input', () => {
        auto = false;
        p = +sl.value;
        if (autoStatusText) autoStatusText.textContent = 'LOOP PAUSED';
      });
    }

    let lastTime = performance.now();

    function loop(now) {
      requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // CONTINUOUS INFINITE AUTO-BUILD LOOPING ENGINE
      if (auto) {
        p += dt * 5.0;
        if (p >= 106) {
          p = 0; // Seamlessly reset to 0% and repeat floor construction endlessly!
        }
        if (sl) sl.value = Math.min(100, Math.max(0, p));
      }

      const clampedP = Math.min(100, Math.max(0, p));
      const n = Math.round((clampedP / 100) * FL);
      if (flb) flb.textContent = `${n} / ${FL}`;
      if (pcb) pcb.textContent = `${Math.round(clampedP)}%`;

      fl.forEach((f, i) => {
        const on = i < n;
        f.scale.y += ((on ? 1 : 0.001) - f.scale.y) * Math.min(1, dt * 10);
        f.visible = f.scale.y > 0.01;
        f.glass.visible = i < n - 2;
        f.rb.visible = i === n - 1;
      });

      // UPDATE ALL SURROUNDING CITY BUILDINGS (LIVE URBAN DEVELOPMENT SIMULATION)
      cityDevBuildings.forEach(devB => {
        const devP = Math.min(100, Math.max(0, clampedP * devB.speed));
        const devActiveFloors = Math.round((devP / 100) * devB.totalFloors);

        devB.floors.forEach((fObj, fI) => {
          const isFinished = fI < devActiveFloors;
          fObj.group.scale.y += ((isFinished ? 1 : 0.001) - fObj.group.scale.y) * Math.min(1, dt * 10);
          fObj.group.visible = fObj.group.scale.y > 0.01;
          fObj.glass.visible = fI < devActiveFloors - 1;
          fObj.rebar.visible = fI === devActiveFloors - 1;
        });

        if (devB.miniCrane) {
          devB.miniCrane.rotation.y += dt * 0.35 * devB.speed;
        }
      });

      const ch = Math.max(0.001, n / FL);
      core.scale.y += (ch - core.scale.y) * Math.min(1, dt * 8);
      core.position.y = (core.scale.y * FL * fh) / 2;

      jib.rotation.y += dt * 0.25;

      if (!drag) ry += dt * 0.08;

      // CAMERA FRAMING
      camera.position.set(Math.sin(ry) * 36, 12 + rx * 20, Math.cos(ry) * 36);
      camera.lookAt(0, 8.5, 0);
      renderer.render(scene, camera);
    }

    requestAnimationFrame(loop);
  }

  // 4. 3D TILT HOVER CARDS (FROM GROUNDWORK.HTML)
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const bounds = card.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width - 0.5;
      const y = (e.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // Bind Swatch Buttons
  document.querySelectorAll('[data-swatch-color]').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.getAttribute('data-swatch-color');
      document.querySelectorAll('[data-swatch-color]').forEach(b => b.classList.remove('active-swatch', 'ring-4', 'ring-white'));
      this.classList.add('active-swatch', 'ring-4', 'ring-white');
      if (window.change3DHouseColor) {
        window.change3DHouseColor(color);
      }
    });
  });

  // 5. ARCHITECTURAL PORTFOLIO DATASET & MODAL
  const portfolioProjects = {
    'gacuriro-villa': {
      title: 'GACURIRO PERGOLA VILLA',
      category: 'Architecture',
      badge: '🏛️ Residential Architecture',
      location: 'Plot 452, Gacuriro Estate, Kigali, Rwanda',
      year: '2024',
      area: '520 m² Built Area · 850 m² Lot',
      status: 'Completed & Certified',
      budget: '$220,000 USD (Verified BOQ)',
      materials: 'Black Belgian Marble, Powder-Coated Steel, Teak Pergola, High-Solar UV Glazing',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      description: 'Luxury 3-story residential villa designed for Kigali’s temperate climate. Features an expansive cantilevered pergola roof terrace, dark marble colonnades, and cross-ventilation corridors that eliminate mechanical AC requirements.'
    },
    'nyarutarama-atrium': {
      title: 'NYARUTARAMA GLASS ATRIUM',
      category: 'Architecture',
      badge: '🏛️ Modern Villa',
      location: 'KG 9 Ave, Nyarutarama, Kigali, Rwanda',
      year: '2023',
      area: '780 m² Built Area · 1,200 m² Lot',
      status: 'Handed Over',
      budget: '$380,000 USD (Turnkey)',
      materials: 'Curtain-Wall Structural Glass, Steel-Blue Aluminium, Reinforced Concrete Core',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      description: 'A striking statement in contemporary residential architecture. Double-height central atrium connecting three stepped living zones with floor-to-ceiling glass, opening directly to a private zen garden courtyard.'
    },
    'kicukiro-infinity': {
      title: 'KICUKIRO INFINITY POOL VILLA',
      category: 'Architecture',
      badge: '🏛️ Hillside Residence',
      location: 'Kicukiro Hill Ridge, Kigali, Rwanda',
      year: '2024',
      area: '640 m² Built Area · 950 m² Lot',
      status: 'Completed & Occupied',
      budget: '$295,000 USD',
      materials: 'Cast Concrete, Teak Wood Decking, Vitrified Porcelain, Solar Micro-Inverters',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      description: 'Perched on the southern ridgeline of Kigali with breathtaking horizon views. Features a 16-meter cantilevered infinity swimming pool, sheltered sun loungers, and deep solar shading eaves.'
    },
    'kiyovu-interior': {
      title: 'KIYOVU MINIMALIST LIVING SALON',
      category: 'Interior',
      badge: '🎨 Interior Architecture',
      location: 'Kiyovu diplomatic enclave, Kigali, Rwanda',
      year: '2024',
      area: '320 m² Interior Footprint',
      status: 'Completed',
      budget: '$115,000 USD (Fit-Out)',
      materials: 'Italian Travertine Stone, Fluted Oak Acoustic Slats, Recessed Brass Lumina',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
      description: 'Comprehensive interior architecture and space planning. Designed with hidden ambient LED coves, bespoke millwork cabinetry, acoustic ceiling baffle integration, and a low-profile travertine fireplace mantle.'
    },
    'norrsken-hub': {
      title: 'KIGALI INNOVATION TOWER & PLAZA',
      category: 'Commercial',
      badge: '🏢 High-Rise Commercial',
      location: 'Kigali CBD / Norrsken Innovation Zone',
      year: '2025',
      area: '12,500 m² Gross Leasable Area',
      status: 'Under Site Construction',
      budget: '$4,200,000 USD (Master Contract)',
      materials: 'Post-Tensioned Slabs, Low-E Double Glazing, Kinetic Shading, Greywater System',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      description: 'A 14-story corporate and technological innovation hub shaping Kigali’s central skyline. Built on rigorous 7-day floor casting cycles with verified BIM coordination and zero-waste rainwater recycling.'
    },
    'twin-terraces': {
      title: 'KAGUGU TWIN TERRACES ESTATE',
      category: 'Interior',
      badge: '🎨 Bespoke Interior & Fitout',
      location: 'Kagugu Green Belt, Kigali, Rwanda',
      year: '2024',
      area: '450 m² Interior Living',
      status: 'Completed',
      budget: '$165,000 USD',
      materials: 'Raw Volcanic Rwandan Basalt, Natural Linen, Matte Black Aluminum, Smoked Oak',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      description: 'Organic minimalist interior design blending indigenous Rwandan volcanic stone accents with Scandinavian furniture ergonomics, open-concept island kitchens, and bespoke panoramic reading nooks.'
    }
  };

  window.openProjectModal = function(id) {
    const data = portfolioProjects[id];
    if (!data) return;

    const modal = document.getElementById('projectModal');
    if (!modal) return;

    document.getElementById('modalImg').src = data.image;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalCategory').textContent = data.badge;
    document.getElementById('modalDesc').textContent = data.description;
    document.getElementById('modalLocation').textContent = data.location;
    document.getElementById('modalYear').textContent = data.year;
    document.getElementById('modalArea').textContent = data.area;
    document.getElementById('modalBudget').textContent = data.budget;
    document.getElementById('modalMaterials').textContent = data.materials;
    document.getElementById('modalStatus').textContent = data.status;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close on backdrop click or ESC
  const modalElem = document.getElementById('projectModal');
  if (modalElem) {
    modalElem.addEventListener('click', (e) => {
      if (e.target === modalElem) window.closeProjectModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeProjectModal();
  });

  // Portfolio Filtering
  window.filterProjects = function(category, btnElem) {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');

    const cards = document.querySelectorAll('.project-card-item');
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // FAQ Accordion Handler
  window.toggleFaq = function(button) {
    const item = button.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) {
      item.classList.add('active');
    }
  };

  // Consultation Form Handler
  window.handleConsultationSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.clientName.value.trim();
    const email = form.clientEmail.value.trim();
    const phone = form.clientPhone.value.trim();
    const service = form.projectType.value;
    const location = form.projectLocation.value.trim() || 'Kigali, Rwanda';
    const budget = form.estimatedBudget.value;
    const notes = form.projectNotes.value.trim();

    if (!name || !email) {
      alert('Please provide your name and email address to calculate your BOQ quote.');
      return;
    }

    const quoteId = '#KEY-' + Math.floor(1000 + Math.random() * 9000);
    const newQuote = {
      id: quoteId,
      clientName: name,
      email: email,
      phone: phone,
      projectType: service,
      location: location,
      estimatedBudget: budget,
      status: 'Engineering Review Active',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      notes: notes
    };

    const existingQuotes = JSON.parse(localStorage.getItem('keystone-user-quotes') || '[]');
    existingQuotes.unshift(newQuote);
    localStorage.setItem('keystone-user-quotes', JSON.stringify(existingQuotes));

    const submitBtn = document.getElementById('consultationSubmitBtn');
    if (submitBtn) {
      submitBtn.innerHTML = `<span>✓ QUOTE ${quoteId} REGISTERED</span>`;
      submitBtn.classList.add('!bg-emerald-500', '!text-black', '!border-emerald-400');
    }

    setTimeout(() => {
      window.location.href = 'client-portal.html';
    }, 1200);
  };

  // 6. HEADER AUTO-ADVANCING VIDEO SLIDER ENGINE (SCROLL TO RIGHT ON ENDED)
  function initHeaderVideoSlider() {
    const track = document.getElementById('videoSliderTrack');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.video-slide-item'));
    const pills = Array.from(document.querySelectorAll('.video-pill-btn'));
    const runner = document.getElementById('videoTimelineFill');
    const hudTitle = document.getElementById('hudProjectTitle');
    const hudCategory = document.getElementById('hudProjectCategory');
    const hudSubtitle = document.getElementById('hudProjectSubtitle');
    const prevBtn = document.getElementById('heroVideoPrevBtn');
    const nextBtn = document.getElementById('heroVideoNextBtn');
    const pausePlayBtn = document.getElementById('heroVideoPausePlayBtn');

    let currentIndex = 0;
    let fallbackTimer = null;

    const slideMeta = [
      {
        title: 'GACURIRO PERGOLA VILLA',
        category: '🏛️ LUXURY RESIDENTIAL ARCHITECTURE · KIGALI',
        subtitle: 'Cantilevered roof pergolas and black marble colonnades engineered with bioclimatic cross-ventilation.'
      },
      {
        title: 'NYARUTARAMA GLASS ATRIUM',
        category: '🏛️ SPATIAL LIGHT & CONTEMPORARY LIVING · NYARUTARAMA',
        subtitle: 'Double-height structural glass curtain walls merging landscaped exterior gardens with interior serenity.'
      },
      {
        title: 'KIGALI INNOVATION TOWER',
        category: '🏢 COMMERCIAL HIGH-RISE & URBAN HORIZONS · CBD',
        subtitle: '14-story post-tensioned reinforced concrete core built on precision 7-day cyclical casting schedules.'
      },
      {
        title: 'KIYOVU MINIMALIST RESIDENCE',
        category: '🎨 BESPOKE INTERIOR ARCHITECTURE · KIYOVU',
        subtitle: 'Travertine fireplace hearths, fluted acoustic oak paneling, and ambient cove illumination.'
      }
    ];

    function updateHud(index) {
      if (slideMeta[index]) {
        if (hudTitle) hudTitle.textContent = slideMeta[index].title;
        if (hudCategory) hudCategory.textContent = slideMeta[index].category;
        if (hudSubtitle) hudSubtitle.textContent = slideMeta[index].subtitle;
      }
    }

    function goToSlide(index, forward = true) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Reset all progress bars
      pills.forEach((p, i) => {
        p.classList.toggle('active', i === currentIndex);
        const prog = p.querySelector('.video-pill-progress');
        if (prog) prog.style.width = '0%';
      });
      if (runner) runner.style.width = '0%';

      // Handle video playback
      slides.forEach((slide, i) => {
        const vid = slide.querySelector('video');
        if (vid) {
          if (i === currentIndex) {
            slide.classList.add('active');
            vid.currentTime = 0;
            vid.play().then(() => {
              if (pausePlayBtn) pausePlayBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i>';
              if (window.lucide) lucide.createIcons();
            }).catch(err => {
              console.log('Video autoplay fallback:', err);
              clearTimeout(fallbackTimer);
              fallbackTimer = setTimeout(() => {
                goToSlide(currentIndex + 1);
              }, 7000);
            });
          } else {
            slide.classList.remove('active');
            vid.pause();
            vid.currentTime = 0;
          }
        }
      });

      updateHud(currentIndex);
    }

    // Attach ended event and timeupdate to each video
    slides.forEach((slide, idx) => {
      const vid = slide.querySelector('video');
      if (vid) {
        // Auto scroll to right to new one direct on ended!
        vid.addEventListener('ended', () => {
          goToSlide(currentIndex + 1, true);
        });

        // Track live progress
        vid.addEventListener('timeupdate', () => {
          if (idx === currentIndex && vid.duration) {
            const pct = (vid.currentTime / vid.duration) * 100;
            if (runner) runner.style.width = `${pct}%`;
            const activePill = pills[currentIndex];
            if (activePill) {
              const prog = activePill.querySelector('.video-pill-progress');
              if (prog) prog.style.width = `${pct}%`;
            }
          }
        });

        // Error handling fallback
        vid.addEventListener('error', () => {
          clearTimeout(fallbackTimer);
          fallbackTimer = setTimeout(() => {
            goToSlide(currentIndex + 1);
          }, 7000);
        });
      }
    });

    // Pill click navigation
    pills.forEach((pill, i) => {
      pill.addEventListener('click', () => {
        clearTimeout(fallbackTimer);
        goToSlide(i);
      });
    });

    // Prev / Next button listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        clearTimeout(fallbackTimer);
        goToSlide(currentIndex - 1, false);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        clearTimeout(fallbackTimer);
        goToSlide(currentIndex + 1, true);
      });
    }

    // Pause / Play toggle
    if (pausePlayBtn) {
      pausePlayBtn.addEventListener('click', () => {
        const activeVid = slides[currentIndex]?.querySelector('video');
        if (activeVid) {
          if (activeVid.paused) {
            activeVid.play();
            pausePlayBtn.innerHTML = '<i data-lucide="pause" class="w-4 h-4"></i>';
          } else {
            activeVid.pause();
            pausePlayBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i>';
          }
          if (window.lucide) lucide.createIcons();
        }
      });
    }

    // Initialize first slide
    goToSlide(0);
  }

  init3DHouseViewer();
  initLiveTowerBuilder();
  initHeaderVideoSlider();

});

