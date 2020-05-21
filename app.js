let loadScene = document.getElementById("loadingScene");

function MAIN() {
  // these need to be accessed inside more than one function so we'll declare them first
  let container;

  let containerHelp = document.querySelector("#scene-containerHelp");
  let canvasHelp = document.getElementById(containerHelp.id);

  let divHelpID = document.querySelector("#scene-openHelper");
  let canvasOpenHelp = document.getElementById(divHelpID.id);
  let canvasHelpHeight = "320px";
  let canvasOpenHelpWidthHeight = "72px";
  let canvasOpenHelpBottom = "10px";
  let canvasOpenHelpLeft = "10px";
  //
  let light;
  let camera;
  let cameraHelper;
  let controls;
  let controlsHelper;
  let renderer;
  let rendererHelp;
  let scene;
  let sceneHelper;
  let sunMesh,
    earthMesh,
    moonMesh,
    venusMesh,
    mercuryMesh,
    marsMesh,
    jupyterMesh,
    saturnMesh,
    saturnRingMesh,
    uranusMesh,
    uranusRingMesh,
    neptunoMesh;

  let mercuryoOrbitPathMesh;
  let venusOrbitPathMesh;
  let earthOrbitPathMesh;
  let marsOrbitPathMesh;
  let jupyterOrbitPathMesh;
  let saturnOrbitPathMesh;
  let uranusOrbitPathMesh;
  let neptunoOrbitPathMesh;

  let ambientLight;
  var axesHelper;

  let dataControls = {
    Rotation_Speed: 0.03,
    Orbit_Speed: 0.03,
    Stop_Animation: false
  };

  //change value only for the trhee constants below
  var SUNSCALE_RADIUS = 5;
  var SIMULATION_SPEED_ORBIT = 0.05;
  var SIMULATION_SPEED_ROTATION = 0.05;
  const REALLITYSCALEFACTOR_RADIUS = 38;
  const REALLITYSCALEFACTOR_UA_DIST = 10;
  ///////////////////////////////////////

  const MERCURY_SCALE_REF_SUN = 0.003503554; //mercury/sun diameter
  const VENUS_SCALE_REF_SUN = 0.008691032;
  const EARTH_SCALE_REF_SUN = 0.009159331;
  const MOON_SCALE_REF_EARTH = 0.272484; // 0.272353836 = moon/earth diameter
  const MARS_SCALE_REF_SUN = 0.002433762; //mars/sun diameter
  const JUPYTER_SCALE_REF_SUN = 0.100394916;
  const SATURN_SCALE_REF_SUN = 0.083621742;
  const URANUS_SCALE_REF_SUN = 0.03642134;
  const NEPTUNO_SCALE_REF_SUN = 0.035358656;

  const MERCURY_DISTFROM_SUN_UA = 0.39;
  const VENUS_DISTFROM_SUN_UA = 0.72;
  const EARTH_DISTFROM_SUN_UA = 1;
  const MOON_DISTFROM_EARTH_UA = 0.00267;
  const MARS_DISTFROM_SUN_UA = 1.52;
  const JUPYTER_DISTFROM_SUN_UA = 5.2;
  const SATURN_DISTFROM_SUN_UA = 9.53;
  const URANUS_DISTFROM_SUN_UA = 19.1;
  const NEPTUNO_DISTFROM_SUN_UA = 30.0;

  let mercuryAstronomicalUnitFactor = 0;
  let venusAstronomicalUnitFactor = 0;
  let earthAstronomicalUnitFactor = 0;
  let moonAstronomicalUnitFactor = 0;
  let marsAstronomicalUnitFactor = 0;
  let jupyterAstronomicalUnitFactor = 0;
  let saturnAstronomicalUnitFactor = 0;
  let uranusAstronomicalUnitFactor = 0;
  let neptunoAstronomicalUnitFactor = 0;

  const SUN_INIT_POS_X = 0;
  const SUN_INIT_POS_Y = 0;
  const SUN_INIT_POS_Z = 0;

  //Orbit rating
  let EARTHANGLE = 0; //# this is the angle in degrees representing the Earth's year-long motion around the Sun - so use 0 to 360 (default 0)
  let MOONANGLE = 0; //# this is an angle in degrees representing the Moon's month-long motion around the Earth - so use 0 to 360 (default 0)
  let MERCURYANGLE = 0;
  let VENUSANGLE = 0;
  let MARSANGLE = 0;
  let JUPYTERANGLE = 0;
  let SATURNANGLE = 0;
  let URANUSANGLE = 0;
  let NEPTUNOANGLE = 0;

  const EARTHORBITRATING = 1.0; //#Período Orbital : 360/365,256363004 = 0.999298   (Almost 1 degree per day)
  const MOONORBITINGRATING = 13.0; //#Período Orbital Lua : 27. 360/27
  const MERCURYORBITRATING = 4.09; //# Mercury orbits the Sun about 3.7 degree per day. it takes about 88 solar days to orbit the sun  360/88 = 4.090909
  const VENUSORBITRATING = 1.6; //# 225 dias solares. 360/225
  const MARSORBITRATING = 0.52; //#687 solar days
  const JUPYTERORBITING = 0.08; //12 anos (12*365 = 4380dias) 360/4380 = 0.08219
  const SATURNORBITINGRATING = 0.03; //360 / 29ANOS(10585)
  const URANUSORBITINGRATING = 0.01; //360 / 84ANOS(30660)
  const NEPTUNOORBITINGRATING = 0.006; //360 / 165ANOS(60225)

  let sunRadius = SUNSCALE_RADIUS;
  let earthRadius =
    sunRadius * EARTH_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;
  let mercuryRadius =
    sunRadius * MERCURY_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;
  let venusRadius =
    sunRadius * VENUS_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;
  let moonRadius = earthRadius * MOON_SCALE_REF_EARTH;
  let marsRadius = sunRadius * MARS_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;
  let jupyterRadius = JUPYTER_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS; //Eu não uso o raio do sol aqui pois o planeta sairia muito gigante
  let saturnRadius = SATURN_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS; //idem acima
  let uranusRadius = URANUS_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;
  let neptunoRadius = NEPTUNO_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;

  const widthSegments = 128;
  const heightSegments = 128;

  const sceneBackgroundColor = 0x000000;

  function init() {
    container = document.querySelector("#scene-container");
    // containerHelp = document.querySelector("#scene-containerHelp");
    // canvasHelp = document.getElementById(containerHelp.id);

    // canvasOpenHelp = document.getElementById(divHelpID.id);

    createSpeedMenu();

    scene = new THREE.Scene();
    sceneHelper = new THREE.Scene();

    scene.background = new THREE.Color(sceneBackgroundColor);
    sceneHelper.background = new THREE.Color(sceneBackgroundColor);

    createCamera();
    // createCameraHelper();

    createControls();
    // createControlsHelper();

    createLights();
    createMeshes();
    createMeshesHelper();

    createRenderer();
    // createRendererHelp();

    // start the animation loop
    renderer.setAnimationLoop(() => {
      update();
      render();
    });

    // // start the animation loop
    // rendererHelp.setAnimationLoop(() => {
    //   updateHelper();
    //   renderHelp();
    // });
  }

  function createCamera() {
    camera = new THREE.PerspectiveCamera(
      5, // FOV
      container.clientWidth / container.clientHeight, // aspect
      10, // near clipping plane
      4000 // far clipping plane,
    );

    // var helper = new THREE.CameraHelper(camera);
    // scene.add(helper);
    // compute a target direction

    camera.position.set(-325, 308, 750);
  }

  function createCameraHelper() {
    cameraHelper = new THREE.PerspectiveCamera(
      3, // FOV
      containerHelp.clientWidth / containerHelp.clientHeight, // aspect
      10, // near clipping plane
      1000 // far clipping plane,
    );
    cameraHelper.position.set(0, 0, 750);
  }

  function createControls() {
    controls = new THREE.OrbitControls(camera, container);

    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.cameraPan = true;

    controls.update();
  }

  function createControlsHelper() {
    controlsHelper = new THREE.OrbitControls(cameraHelper, containerHelp);

    controlsHelper.enableZoom = false;
    controlsHelper.enableRotate = false;
    controlsHelper.autoRotate = false;
    controlsHelper.cameraPan = false;

    controlsHelper.update();
  }

  function createLights() {
    //I added HemisphereLight so we can see the dark side of the planets
    //Without these additional lights we cannot see anything (only black)
    ambientLight = new THREE.HemisphereLight(
      0xffffff, // sky color
      0x202020, // ground color
      0.4 // intensity
    );

    var ambientLightHelper = new THREE.HemisphereLight(
      0xffffff, // sky color
      0x202020, // ground color
      0.4 // intensity
    );

    // cameraHelper.add(ambientLightHelper);
    // sceneHelper.add(ambientLightHelper);
    scene.add(ambientLight);

    //create directional light
    //These light goes in the center of the sun to shine all directions
    light = new THREE.PointLight(0xffffff, 14000, 0, 2);
    //move light
    light.position.set(0, 0, SUN_INIT_POS_Z);
    light.castShadow = true; // default false
    light.shadow.mapSize.width = 1512; // default
    light.shadow.mapSize.height = 1512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 4000; // default

    camera.add(light);
    scene.add(light);

    // The X axis is red. The Y axis is green. The Z axis is blue.
    axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);

    //Create a helper for the shadow camera (optional)
    // var helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);
  }

  function createMeshesHelper() {
    //create and set position of canvasOpenHelp (Help Icon on left bottom)
    canvasOpenHelp.style.bottom = canvasOpenHelpBottom;
    canvasOpenHelp.style.left = canvasOpenHelpLeft;

    canvasOpenHelp.style.width = canvasOpenHelpWidthHeight;
    canvasOpenHelp.style.height = canvasOpenHelpWidthHeight;

    //set canvasHelper at bottom
    canvasHelp.style.bottom = "0px";
    //canvasHelpe for first time is hidden
    canvasHelp.style.height = "0px";

    // var geometry = new THREE.PlaneGeometry(
    //   containerHelp.clientWidth + 800,
    //   containerHelp.clientHeight,
    //   64
    // );
    // var material = new THREE.MeshBasicMaterial({
    //   color: 0xffffff,
    //   transparent: true,
    //   opacity: 0.5
    // });
    // var plane = new THREE.Mesh(geometry, material);
    // plane.rotation.z = 1.5708;
    // //plane.position.set(0, container.clientHeight - containerHelp.clientHeight, 0);

    // sceneHelper.add(plane);
  }

  function createMeshes() {
    const sunSphere = new THREE.SphereBufferGeometry(
      sunRadius,
      widthSegments,
      heightSegments
    );
    sunSphere.castShadow = true; //default is false

    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("https://i.ibb.co/3srcxqp/Sol.jpg");
    sunTexture.encoding = THREE.sRGBEncoding;
    sunTexture.anisotropy = 16;

    const sunMaterial = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveMap: sunTexture,
      roughness: 1,
      normalScale: new THREE.Vector2(4, 4)
    });
    sunMesh = new THREE.Mesh(sunSphere, sunMaterial);
    sunMesh.position.set(SUN_INIT_POS_X, SUN_INIT_POS_Y, SUN_INIT_POS_Z);

    ////////////////////MERCURY///////////////////////////////////

    const mercurySphere = new THREE.SphereBufferGeometry(
      mercuryRadius,
      widthSegments,
      heightSegments
    );
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "https://i.ibb.co/Z2qdm1M/2k-mercury.jpg"
      ),
      bumpMap: new THREE.TextureLoader().load(
        "https://i.ibb.co/2cXm7Ld/mercurybump.jpg"
      ),
      bumpScale: 0.002,
      roughness: 1
    });

    var mercuryCenterPosition =
      SUN_INIT_POS_X +
      SUNSCALE_RADIUS +
      mercuryRadius +
      MERCURY_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    mercuryMesh = new THREE.Mesh(mercurySphere, mercuryMaterial);
    mercuryMesh.position.set(mercuryCenterPosition, 0, 0);

    //draw planet orbit line
    mercuryoOrbitPathMesh = drawEllipseOrbitPath(
      mercuryCenterPosition,
      0xffffff
    );

    mercuryAstronomicalUnitFactor = mercuryCenterPosition;

    ///////////////VENUS////////////////////////////////////////

    const venusSphere = new THREE.SphereBufferGeometry(
      venusRadius,
      widthSegments,
      heightSegments
    );

    let venusCenterPosition =
      mercuryMesh.position.x +
      mercuryRadius +
      venusRadius +
      VENUS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    const venusMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
        "https://i.ibb.co/pPPFV0R/venusmap.jpg"
      ),
      bumpMap: new THREE.TextureLoader().load(
        "https://i.ibb.co/Gtw6t8x/venusbump.jpg"
      ),
      bumpScale: 0.002,
      roughness: 1
    });

    venusMesh = new THREE.Mesh(venusSphere, venusMaterial);
    venusMesh.position.set(venusCenterPosition, 0, 0);

    //draw planet orbit line
    venusOrbitPathMesh = drawEllipseOrbitPath(venusCenterPosition, 0xffffff);
    venusAstronomicalUnitFactor = venusCenterPosition;

    ///////////////EARTH////////////////////////////////////////
    const earthSphere = new THREE.SphereBufferGeometry(
      earthRadius,
      widthSegments,
      heightSegments
    );

    let earthCenterPosition =
      venusMesh.position.x +
      venusRadius +
      earthRadius +
      EARTH_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/M8wzz6b/Earth.png"),
      normalMap: textureLoader.load(
        "https://i.ibb.co/SBLFSV0/Earth-Normal.png"
      ),
      specularMap: textureLoader.load(
        "https://i.ibb.co/LgKKt9G/Earth-Spec.png"
      ),
      normalScale: new THREE.Vector2(6, 6)
    });
    earthMaterial.anisotropy = 16;
    earthMaterial.encoding = THREE.sRGBEncoding;

    earthMesh = new THREE.Mesh(earthSphere, earthMaterial);
    earthMesh.position.set(earthCenterPosition, 0, 0);
    //simular inclinacao da Terra (radians)
    earthMesh.rotation.z = -0.401426;

    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;
    //draw earth orbit line
    earthOrbitPathMesh = drawEllipseOrbitPath(earthCenterPosition, 0xffffff);
    earthAstronomicalUnitFactor = earthCenterPosition;

    /////////////////MOON//////////////////////////////////////////
    const moonSphere = new THREE.SphereBufferGeometry(
      moonRadius,
      widthSegments,
      heightSegments
    );

    let moonCenterPosition =
      earthMesh.position.x + earthRadius * 2 + MOON_DISTFROM_EARTH_UA;

    var moonMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/2cHJLGh/moonmap1k.jpg"),
      bumpMap: textureLoader.load("https://i.ibb.co/7vDSSZz/moonbump1k.jpg"),
      bumpScale: 0.002
    });
    moonMaterial.anisotropy = 16;
    moonMaterial.encoding = THREE.sRGBEncoding;

    moonMesh = new THREE.Mesh(moonSphere, moonMaterial);
    moonMesh.position.set(moonCenterPosition, 0, 0);
    moonAstronomicalUnitFactor = earthRadius * 2 + MOON_DISTFROM_EARTH_UA;

    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    //////////////////////////MARS///////////////////////////

    const marsSphere = new THREE.SphereBufferGeometry(
      marsRadius,
      widthSegments,
      heightSegments
    );

    let marsCenterPosition =
      earthMesh.position.x +
      earthRadius +
      marsRadius +
      MARS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var marsMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/q1XsgSB/marsmap1k.jpg"),
      bumpMap: textureLoader.load("https://i.ibb.co/QMyJ17w/marsbump1k.jpg"),
      bumpScale: 0.002
    });
    marsMesh = new THREE.Mesh(marsSphere, marsMaterial);
    marsMesh.position.set(marsCenterPosition, 0, 0);

    //draw earth orbit line
    marsOrbitPathMesh = drawEllipseOrbitPath(marsCenterPosition, 0xffffff);
    marsAstronomicalUnitFactor = marsCenterPosition;

    //////////////////////////JUPYTER///////////////////////////

    const jupyterSphere = new THREE.SphereBufferGeometry(
      jupyterRadius,
      widthSegments,
      heightSegments
    );

    let jupyterCenterPosition =
      marsMesh.position.x +
      marsRadius +
      jupyterRadius +
      JUPYTER_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var jupyterMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/rmJWC8m/jupitermap.jpg")
    });
    jupyterMesh = new THREE.Mesh(jupyterSphere, jupyterMaterial);
    jupyterMesh.position.set(jupyterCenterPosition, 0, 0);

    //draw earth orbit line
    jupyterOrbitPathMesh = drawEllipseOrbitPath(
      jupyterCenterPosition,
      0xffffff
    );
    jupyterAstronomicalUnitFactor = jupyterCenterPosition;

    ///////////////////////////////////////////////////////////////

    //////////////////////////SATURN ///////////////////////////

    const saturnSphere = new THREE.SphereBufferGeometry(
      saturnRadius,
      widthSegments,
      heightSegments
    );

    let saturnCenterPosition =
      jupyterMesh.position.x +
      jupyterRadius +
      saturnRadius +
      SATURN_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var saturnMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/HqgCYCD/saturnmap.jpg")
    });
    saturnMesh = new THREE.Mesh(saturnSphere, saturnMaterial);
    saturnMesh.rotation.z = -0.471239;
    saturnMesh.position.set(saturnCenterPosition, 0, 0);

    //Draw Saturn Ring
    const saturnInnerRadius = saturnRadius + 1;
    const saturnOuterRadius = saturnRadius + 5;
    const saturnThetaSegments = 60;

    const saturnRingGeometry = new THREE.RingBufferGeometry(
      saturnInnerRadius,
      saturnOuterRadius,
      saturnThetaSegments
    );

    var pos = saturnRingGeometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      saturnRingGeometry.attributes.uv.setXY(
        i,
        v3.length() < saturnInnerRadius + 1 ? 0 : 1,
        1
      );
    }

    var saturnRingMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load("https://i.ibb.co/LQwTkmy/saturnringpattern.gif"),
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });

    saturnRingMesh = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRingMesh.rotation.x = 1.5708; //rotaciona o eixo X na mesma direcao do eixo x dos planetas
    saturnRingMesh.rotation.y = -0.45;

    //draw saturn orbit line
    saturnOrbitPathMesh = drawEllipseOrbitPath(saturnCenterPosition, 0xffffff);
    saturnAstronomicalUnitFactor = saturnCenterPosition;
    saturnRingMesh.position.x = saturnMesh.position.x;

    //////////////////////////URANUS ///////////////////////////

    const uranusSphere = new THREE.SphereBufferGeometry(
      uranusRadius,
      widthSegments,
      heightSegments
    );

    let uranusCenterPosition =
      saturnMesh.position.x +
      saturnRadius +
      uranusRadius +
      URANUS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var uranusMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/SsPvzx0/uranusmap.jpg")
    });
    uranusMesh = new THREE.Mesh(uranusSphere, uranusMaterial);
    uranusMesh.rotation.z = -1.706932; //97,8degrees
    uranusMesh.position.set(uranusCenterPosition, 0, 0);

    //Draw Saturn Ring
    const uranusInnerRadius = uranusRadius + 1;
    const uranusOuterRadius = uranusRadius + 4;
    const uranusThetaSegments = 60;

    const uranusRingGeometry = new THREE.RingBufferGeometry(
      uranusInnerRadius,
      uranusOuterRadius,
      uranusThetaSegments
    );

    var posUranus = uranusRingGeometry.attributes.position;
    var v3Uranus = new THREE.Vector3();
    for (let i = 0; i < posUranus.count; i++) {
      v3Uranus.fromBufferAttribute(posUranus, i);
      uranusRingGeometry.attributes.uv.setXY(
        i,
        v3Uranus.length() < uranusInnerRadius + 1 ? 0 : 1,
        1
      );
    }

    var uranusRingMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load("https://i.ibb.co/RHdh0ym/uranusringtrans.gif"),
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });

    uranusRingMesh = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
    uranusRingMesh.rotation.x = 1.5708; //rotaciona o eixo X na mesma direcao do eixo x dos planetas
    uranusRingMesh.rotation.y = -1.706932; //97.8degree

    //draw uranus orbit line
    uranusOrbitPathMesh = drawEllipseOrbitPath(uranusCenterPosition, 0xffffff);
    uranusAstronomicalUnitFactor = uranusCenterPosition;
    uranusRingMesh.position.x = uranusMesh.position.x;
    ///////////////////////////////////////////////////////////////

    //////////////////////////NEPTUNO ///////////////////////////

    const neptunoSphere = new THREE.SphereBufferGeometry(
      neptunoRadius,
      widthSegments,
      heightSegments
    );

    let neptunoCenterPosition =
      uranusMesh.position.x +
      uranusRadius +
      neptunoRadius +
      NEPTUNO_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

    var neptunoMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load("https://i.ibb.co/DtfRtw5/neptunemap.jpg")
    });
    neptunoMesh = new THREE.Mesh(neptunoSphere, neptunoMaterial);
    neptunoMesh.rotation.z = -0.49410271; //97,8degrees
    neptunoMesh.position.set(neptunoCenterPosition, 0, 0);

    //draw neptuno orbit line
    neptunoOrbitPathMesh = drawEllipseOrbitPath(
      neptunoCenterPosition,
      0xffffff
    );

    neptunoAstronomicalUnitFactor = neptunoCenterPosition;

    ///////////////////////////////////////////////////////////////

    //Create a plane that receives shadows (but does not cast them)
    // var planeGeometry = new THREE.PlaneBufferGeometry(40, 40, 52, 52);
    // var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    // var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // plane.position.y = -10;
    // plane.rotation.y = 0;
    // plane.rotation.x = 5;
    // plane.rotation.z = 16;
    // plane.receiveShadow = false;

    //scene.add(plane);

    scene.add(sunMesh);
    scene.add(venusMesh);
    scene.add(mercuryMesh);
    scene.add(earthMesh);
    scene.add(moonMesh);
    scene.add(marsMesh);
    scene.add(jupyterMesh);
    scene.add(saturnMesh);
    scene.add(saturnRingMesh);
    scene.add(uranusMesh);
    scene.add(uranusRingMesh);
    scene.add(neptunoMesh);
  }

  function createRenderer() {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.gammaFactor = 2.2;
    // renderer.gammaOutput = true;
    renderer.outputEncoding = THREE.GammaEncoding;

    renderer.gammaOutput = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;

    renderer.physicallyCorrectLights = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
  }

  function createRendererHelp() {
    rendererHelp = new THREE.WebGLRenderer({
      antialias: true
    });

    rendererHelp.setSize(containerHelp.clientWidth, containerHelp.clientHeight);

    rendererHelp.setPixelRatio(window.devicePixelRatio);

    rendererHelp.gammaFactor = 2.2;

    rendererHelp.outputEncoding = THREE.GammaEncoding;

    rendererHelp.gammaOutput = true;
    rendererHelp.toneMapping = THREE.ReinhardToneMapping;

    rendererHelp.physicallyCorrectLights = true;

    rendererHelp.shadowMap.enabled = true;
    rendererHelp.shadowMap.type = THREE.PCFSoftShadowMap;

    containerHelp.appendChild(rendererHelp.domElement);
  }

  // perform any updates to the scene, called once per frame
  // avoid heavy computation here
  function update() {
    //Frame is updated every 60FPS. the render function is called every 60 times a second
    // console.log(SIMULATION_SPEED_ORBIT);
    //////////////////////Define orbit of the planets/////////////////////////
    mercuryMesh.position.set(
      mercuryAstronomicalUnitFactor * Math.cos(MERCURYANGLE),
      0,
      mercuryAstronomicalUnitFactor * Math.sin(MERCURYANGLE)
    );

    ////////VENUS//////////////////////
    venusMesh.position.set(
      venusAstronomicalUnitFactor * Math.cos(VENUSANGLE),
      0,
      venusAstronomicalUnitFactor * Math.sin(VENUSANGLE)
    );

    //////////EARTH////////////////////
    earthMesh.position.set(
      earthAstronomicalUnitFactor * Math.cos(EARTHANGLE),
      0,
      earthAstronomicalUnitFactor * Math.sin(EARTHANGLE)
    );

    //////////MOON////////////////////
    moonMesh.position.x =
      earthMesh.position.x + moonAstronomicalUnitFactor * Math.cos(MOONANGLE);
    moonMesh.position.y = 0;
    moonMesh.position.z =
      earthMesh.position.z + moonAstronomicalUnitFactor * Math.sin(MOONANGLE);

    //////////MARS////////////////////
    marsMesh.position.set(
      marsAstronomicalUnitFactor * Math.cos(MARSANGLE),
      0,
      marsAstronomicalUnitFactor * Math.sin(MARSANGLE)
    );

    //////////JUPITER////////////////////
    jupyterMesh.position.set(
      jupyterAstronomicalUnitFactor * Math.cos(JUPYTERANGLE),
      0,
      jupyterAstronomicalUnitFactor * Math.sin(JUPYTERANGLE)
    );

    //////////SATURN////////////////////
    saturnMesh.position.set(
      saturnAstronomicalUnitFactor * Math.cos(SATURNANGLE),
      0,
      saturnAstronomicalUnitFactor * Math.sin(SATURNANGLE)
    );
    saturnRingMesh.position.x =
      saturnAstronomicalUnitFactor * Math.cos(SATURNANGLE);
    saturnRingMesh.position.y = 0;
    saturnRingMesh.position.z =
      saturnAstronomicalUnitFactor * Math.sin(SATURNANGLE);

    //////////URANUS////////////////////
    uranusMesh.position.set(
      uranusAstronomicalUnitFactor * Math.cos(URANUSANGLE),
      0,
      uranusAstronomicalUnitFactor * Math.sin(URANUSANGLE)
    );
    uranusRingMesh.position.x =
      uranusAstronomicalUnitFactor * Math.cos(URANUSANGLE);
    uranusRingMesh.position.y = 0;
    uranusRingMesh.position.z =
      uranusAstronomicalUnitFactor * Math.sin(URANUSANGLE);

    //////////NEPTUNO////////////////////
    neptunoMesh.position.set(
      neptunoAstronomicalUnitFactor * Math.cos(NEPTUNOANGLE),
      0,
      neptunoAstronomicalUnitFactor * Math.sin(NEPTUNOANGLE)
    );

    //////CALCULATE ANGLES ROTATION/////////////////////////

    MERCURYANGLE -= convertDegrees_Radians(
      MERCURYORBITRATING * SIMULATION_SPEED_ORBIT
    );
    VENUSANGLE -= convertDegrees_Radians(
      VENUSORBITRATING * SIMULATION_SPEED_ORBIT
    );
    EARTHANGLE -= convertDegrees_Radians(
      EARTHORBITRATING * SIMULATION_SPEED_ORBIT
    );
    MOONANGLE -= convertDegrees_Radians(
      MOONORBITINGRATING * SIMULATION_SPEED_ORBIT
    );
    MARSANGLE -= convertDegrees_Radians(
      MARSORBITRATING * SIMULATION_SPEED_ORBIT
    );

    JUPYTERANGLE -= convertDegrees_Radians(
      JUPYTERORBITING * SIMULATION_SPEED_ORBIT
    );

    SATURNANGLE -= convertDegrees_Radians(
      SATURNORBITINGRATING * SIMULATION_SPEED_ORBIT
    );

    URANUSANGLE -= convertDegrees_Radians(
      URANUSORBITINGRATING * SIMULATION_SPEED_ORBIT
    );

    NEPTUNOANGLE -= convertDegrees_Radians(
      NEPTUNOORBITINGRATING * SIMULATION_SPEED_ORBIT
    );

    ///////////////////////ROTATION///////////////////////////////////////
    sunMesh.rotation.y += convertDegrees_Radians(
      16 * SIMULATION_SPEED_ROTATION
    );
    mercuryMesh.rotation.y += convertDegrees_Radians(
      MERCURYORBITRATING * SIMULATION_SPEED_ROTATION
    );
    venusMesh.rotation.y += convertDegrees_Radians(
      VENUSORBITRATING * SIMULATION_SPEED_ROTATION
    );
    earthMesh.rotation.y += convertDegrees_Radians(
      EARTHORBITRATING * SIMULATION_SPEED_ROTATION
    );
    moonMesh.rotation.y += convertDegrees_Radians(
      MOONORBITINGRATING * SIMULATION_SPEED_ROTATION
    );
    marsMesh.rotation.y += convertDegrees_Radians(
      MARSORBITRATING * SIMULATION_SPEED_ROTATION
    );
    jupyterMesh.rotation.y += convertDegrees_Radians(
      JUPYTERORBITING * SIMULATION_SPEED_ROTATION
    );
    saturnMesh.rotation.y += convertDegrees_Radians(
      SATURNORBITINGRATING * SIMULATION_SPEED_ROTATION
    );
    uranusMesh.rotation.y += convertDegrees_Radians(
      URANUSORBITINGRATING * SIMULATION_SPEED_ROTATION
    );
    neptunoMesh.rotation.y += convertDegrees_Radians(
      NEPTUNOORBITINGRATING * SIMULATION_SPEED_ROTATION
    );

    ////////////////////////////////////////////////////////////////////
  }

  function updateHelper() {}

  // render, or 'draw a still image', of the scene
  function render() {
    // camera.up = new THREE.Vector3(10, 10, 10);
    // camera.lookAt(neptunoMesh.position);
    renderer.render(scene, camera);
  }
  // render, or 'draw a still image', of the scene
  function renderHelp() {
    // camera.up = new THREE.Vector3(10, 10, 10);
    // camera.lookAt(neptunoMesh.position);
    rendererHelp.render(sceneHelper, cameraHelper);
  }

  // a function that will be called every time the window gets resized.
  // It can get called a lot, so don't put any heavy computation in here!
  function onWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    // cameraHelper.aspect = containerHelp.clientWidth / containerHelp.clientHeight;
    // update the camera's frustum
    camera.updateProjectionMatrix();
    // cameraHelper.updateProjectionMatrix();
    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);
    // rendererHelp.setSize(containerHelp.clientWidth, containerHelp.clientHeight);
  }

  function onKeyDown(evt) {
    // console.log(evt);

    if (evt.keyCode === 79) {
      //o pause or play rotation planet
      if (SIMULATION_SPEED_ROTATION === 0.0) {
        SIMULATION_SPEED_ROTATION = dataControls.Rotation_Speed;
      } else {
        SIMULATION_SPEED_ROTATION = 0.0;
      }
    } else if (evt.keyCode === 80) {
      //tecla p
      if (SIMULATION_SPEED_ORBIT === 0.0) {
        SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
      } else {
        SIMULATION_SPEED_ORBIT = 0.0;
      }
    } else if (evt.keyCode === 82) {
      //r = reset camera position
      controls.reset();
      camera.position.set(-325, 308, 750);

      SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
    } else if (evt.keyCode === 74) {
      //Jupyter
      camera.position.x = jupyterMesh.position.x - 50;
      camera.position.y = 50;
      camera.position.z = jupyterMesh.position.z + 200;
      camera.lookAt(jupyterMesh.position);
    } else if (evt.keyCode === 77) {
      //tecla m
      camera.position.x = mercuryMesh.position.x;
      camera.position.y = 50;
      camera.position.z = mercuryMesh.position.z + 100;
      camera.lookAt(mercuryMesh.position);
    } else if (evt.keyCode === 78) {
      //tecla n
      camera.position.x = neptunoMesh.position.x - 50;
      camera.position.y = 50;
      camera.position.z = neptunoMesh.position.z;
      camera.lookAt(neptunoMesh.position);
    } else if (evt.keyCode === 83) {
      //tecla s
      camera.position.x = saturnMesh.position.x - 50;
      camera.position.y = 50;
      camera.position.z = saturnMesh.position.z + 200;
      camera.lookAt(saturnMesh.position);
    } else if (evt.keyCode === 85) {
      //tecla u
      camera.position.x = uranusMesh.position.x - 50;
      camera.position.y = 50;
      camera.position.z = uranusMesh.position.z + 200;
      camera.lookAt(uranusMesh.position);
    } else if (evt.keyCode === 86) {
      // tecla v

      camera.position.x = venusMesh.position.x;
      camera.position.y = 50;
      camera.position.z = venusMesh.position.z + 100;
      camera.lookAt(venusMesh.position);
    } else if (evt.keyCode === 69) {
      //tecla e

      // controls.target = new THREE.Vector3(
      //   earthMesh.position.x,
      //   50,
      //   earthMesh.position.z + 100
      // );
      // controls.update();

      camera.position.x = earthMesh.position.x;
      camera.position.y = 50;
      camera.position.z = earthMesh.position.z + 100;
      camera.lookAt(earthMesh.position);

      SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
    } else if (evt.keyCode === 188) {
      SIMULATION_SPEED_ORBIT -= dataControls.Orbit_Speed;
    } else if (evt.keyCode === 190) {
      SIMULATION_SPEED_ORBIT += dataControls.Orbit_Speed;
    }
  }

  function onMouseHelpIconOver() {
    //canvasHelpe is displayed. div css starts with opacity = 0
    canvasHelp.style.height = canvasHelpHeight;
    setOpacityAnime(60, true);
  }

  function onMouseHelpIconOut() {
    //setOpacityAnime(100, false);
  }

  function onformattedHelpOver() {
    // canvasHelp.style.height = "0px";
    setOpacityAnime(100, false);
  }

  function onformattedHelpOut() {}

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", onKeyDown);

  divHelpID.addEventListener("mouseover", onMouseHelpIconOver, false);
  canvasHelp.addEventListener("mouseout", onMouseHelpIconOut, false);

  document
    .getElementById("formattedHelpText")
    .addEventListener("mouseover", onformattedHelpOver, false);
  document
    .getElementById("formattedHelpText")
    .addEventListener("mouseout", onformattedHelpOut, false);

  function setOpacityAnime(steps, show) {
    var opacity,
      factor = 1;
    var increment;

    if (show) {
      opacity = 0;
      increment = 0.01;
    } else {
      opacity = 0.6;
      increment = 0.02;
    }

    if (opacity >= 0.6) {
      factor = -1;
      // clearInterval(interval)
    } else if (opacity <= 0) {
      factor = 1;
    }

    var interval = setInterval(function() {
      canvasHelp.style.opacity = opacity;
      // console.log(opacity);

      if (show) {
        if (opacity <= 0.6) {
          opacity += factor * increment;
        } else {
          clearInterval(interval);
        }
      } else {
        if (opacity >= 0) {
          opacity += factor * increment;
        } else {
          canvasHelp.style.height = "0px";
          clearInterval(interval);
        }
      }
    }, 1000 / steps);
  }

  function convertDegrees_Radians(degree) {
    return degree * (Math.PI / 180);
  }

  function drawEllipseOrbitPath(planetCenterPosition, hexLineColor) {
    var curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      planetCenterPosition,
      planetCenterPosition, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    var points = curve.getPoints(100);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.LineBasicMaterial({ color: hexLineColor });

    // Create the final object to add to the scene
    var mesh = new THREE.Line(geometry, material);
    mesh.rotation.x = 1.5708; //rotaciona o eixo X na mesma direcao do eixo x dos planetas
    scene.add(mesh);

    return mesh;
  }

  function createSpeedMenu() {
    let dataLighting = {
      Hemisphere_Light: true,
      Sun_Light: 14
    };
    let visibleObjects = {
      Orbit_path: true
    };
    let objectsHelper = {
      axisHelper: true
    };

    var gui = new dat.GUI();

    //gui.remember(dataControls);

    var folderSpeed = gui.addFolder("Speed settings");
    folderSpeed
      .add(dataControls, "Rotation_Speed", 0, 3)
      .onChange(function(value) {
        SIMULATION_SPEED_ROTATION = value;
      });
    folderSpeed
      .add(dataControls, "Orbit_Speed", 0, 3)
      .onChange(function(value) {
        SIMULATION_SPEED_ORBIT = value;
      });
    folderSpeed.add(dataControls, "Stop_Animation").onChange(function(value) {
      if (value === true) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(() => {
          update();
          render();
        });
      }
    });

    var folderSpeedLighting = gui.addFolder("Lighting settings");
    folderSpeedLighting
      .add(dataLighting, "Hemisphere_Light")
      .onChange(function(value) {
        if (value) scene.add(ambientLight);
        else scene.remove(ambientLight);
      });

    var folderSpeedSunLighting = gui.addFolder("Sun Light settings");
    folderSpeedSunLighting
      .add(dataLighting, "Sun_Light", 1, 24)
      .onChange(function(value) {
        light.power = value * 1000 * 4 * Math.PI;
      });

    var folderVisibleObjects = gui.addFolder("Objects settings");
    folderVisibleObjects
      .add(visibleObjects, "Orbit_path")
      .onChange(function(value) {
        if (value) {
          scene.add(venusOrbitPathMesh);
          scene.add(mercuryoOrbitPathMesh);
          scene.add(earthOrbitPathMesh);
          scene.add(marsOrbitPathMesh);
          scene.add(jupyterOrbitPathMesh);
          scene.add(saturnOrbitPathMesh);
          scene.add(uranusOrbitPathMesh);
          scene.add(neptunoOrbitPathMesh);
        } else {
          scene.remove(venusOrbitPathMesh);
          scene.remove(mercuryoOrbitPathMesh);
          scene.remove(earthOrbitPathMesh);
          scene.remove(marsOrbitPathMesh);
          scene.remove(jupyterOrbitPathMesh);
          scene.remove(saturnOrbitPathMesh);
          scene.remove(uranusOrbitPathMesh);
          scene.remove(neptunoOrbitPathMesh);
        }
      });

    var folderObjectsHelper = gui.addFolder("Objects Helper");
    folderObjectsHelper
      .add(objectsHelper, "axisHelper")
      .onChange(function(value) {
        if (value) {
          scene.add(axesHelper);
        } else {
          scene.remove(axesHelper);
        }
      });

    // collapse folder1
    folderSpeed.open();
    folderSpeedLighting.close();
    folderSpeedSunLighting.close();
    folderObjectsHelper.close();
  }

  // call the init function to set everything up
  init();
}

try {
  window.onload = function() {
    setInterval(() => {}, 500);
    MAIN();
    loadScene.style.display = "none";
  };
} catch (e) {
  loadScene.style.display = "none";
  console.log(e);
}
