import { LoadingManager } from "./LoadingManager/LoadingManager.js";
import { Camera } from "../three/Camera.js";
import { Controls } from "./Controls/Controls.js";
import { Lights } from "./Lights/Lights.js";
import { Renderer } from "./Renderer/Renderer.js";
import { SkyDome } from "./skyDome/SkyDome.js";
import {
  Paths,
  PlanetsURL,
  MeshsKinds,
  MapKinds,
  PlanetsRings,
  PlanetNames,
  PlanetScales,
  PlanetsConstSize,
  SunLight,
} from "../constants/Constants.js";
import {
  CreatePlanet,
  AdjustPlanetLocation,
} from "../Planets/createPlanets.js";

var manager;
var Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
var planets = [];
var orbit_outlines = new THREE.Object3D();

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function MAIN() {
  manager = new LoadingManager().setLoadManager("loadbar", "loadpg");

  // these need to be accessed inside more than one function so we'll declare them first
  let container = document.querySelector("#scene-container");

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
  let controls;
  let renderer;
  let scene;
  let textureLoader;
  let showSpriteText = true;
  let blockRun = true;

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
    neptunoMesh,
    plutoMesh,
    earth_group_orbit = new THREE.Object3D();

  var skybox_group = new THREE.Object3D();

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
    Orbit_Speed: 22000,
    Stop_Animation: false,
  };

  var SIMULATION_SPEED_ROTATION = 0.05;
  const REALLITYSCALEFACTOR_RADIUS = 38;
  ///////////////////////////////////////

  const SATURN_SCALE_REF_SUN = 0.083621742;
  const URANUS_SCALE_REF_SUN = 0.03642134;

  const SUN_INIT_POS_X = 0;
  const SUN_INIT_POS_Y = 0;
  const SUN_INIT_POS_Z = 0;

  const EARTHORBITRATING = 1.0; //#Período Orbital : 360/365,256363004 = 0.999298   (Almost 1 degree per day)
  const MOONORBITINGRATING = 13.0; //#Período Orbital Lua : 27. 360/27
  const MERCURYORBITRATING = 4.09; //# Mercury orbits the Sun about 3.7 degree per day. it takes about 88 solar days to orbit the sun  360/88 = 4.090909
  const VENUSORBITRATING = 1.6; //# 225 dias solares. 360/225
  const MARSORBITRATING = 0.52; //#687 solar days
  const JUPYTERORBITING = 0.08; //12 anos (12*365 = 4380dias) 360/4380 = 0.08219
  const SATURNORBITINGRATING = 0.03; //360 / 29ANOS(10585)
  const URANUSORBITINGRATING = 0.01; //360 / 84ANOS(30660)
  const NEPTUNOORBITINGRATING = 0.006; //360 / 165ANOS(60225)

  let saturnRadius = SATURN_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS; //idem acima
  let uranusRadius = URANUS_SCALE_REF_SUN * REALLITYSCALEFACTOR_RADIUS;

  const widthSegments = 96;
  const heightSegments = 96;
  const cameraResetPosition = [-650000, 480000, -750000];

  function init() {
    createSpeedMenu();

    scene = new THREE.Scene();

    camera = new Camera(
      container,
      60,
      10000, //0.1    //10000 fixes the depth between meshes in front of others meshs
      3e9,
      cameraResetPosition[0],
      cameraResetPosition[1],
      cameraResetPosition[2]
    );

    controls = new Controls(
      camera,
      container,
      10000, //98300,
      0.8e9,
      true,
      false,
      true,
      1.0
    );

    ambientLight = new Lights(scene).ambientLight(0xffffff, 0.4);
    light = new Lights(scene).lightFromSun(
      0xffffff,
      SunLight.intensity,
      0,
      0,
      0,
      0,
      0,
      true
    );

    // var helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);

    // var gridHelper = new THREE.GridHelper(10, 10000000000);
    // scene.add(gridHelper);

    axesHelper = new Lights(scene).axesHelper(9e8);

    createMeshes();
    generatePlanetData();
    setCanvasHelper();

    renderer = new Renderer(container);

    // start the animation loop
    renderer.setAnimationLoop(() => {
      update();
      render();
    });
  }

  function generatePlanetData() {
    // Generate Planets. Objects handle physics as well as adding 3d object to scene.
    Mercury = new Planet_Gen(Mercury_Info, mercuryMesh, showSpriteText);
    Venus = new Planet_Gen(Venus_Info, venusMesh, showSpriteText);
    Moon = new Planet_Gen(Moon_Info, moonMesh, showSpriteText);
    Earth = new Planet_Gen(Earth_Info, earthMesh, showSpriteText);
    Mars = new Planet_Gen(Mars_Info, marsMesh, showSpriteText);
    Jupiter = new Planet_Gen(Jupiter_Info, jupyterMesh, showSpriteText);
    Saturn = new Planet_Gen(Saturn_Info, saturnMesh, showSpriteText);
    Uranus = new Planet_Gen(Uranus_Info, uranusMesh, showSpriteText);
    Neptune = new Planet_Gen(Neptune_Info, neptunoMesh, showSpriteText);
    Pluto = new Planet_Gen(Pluto_Info, plutoMesh, showSpriteText);

    //sets Orbital path line
    planets = [
      Mercury,
      Venus,
      Earth,
      Moon,
      Mars,
      Jupiter,
      Saturn,
      Uranus,
      Neptune,
      Pluto,
    ];
    orbit_outlines = new CreatePlanet(textureLoader).setOrbitalPlanetLine(
      planets
    );
    scene.add(orbit_outlines);
  }

  function setCanvasHelper() {
    //create and set position of canvasOpenHelp (Help Icon on left bottom)
    canvasOpenHelp.style.bottom = canvasOpenHelpBottom;
    canvasOpenHelp.style.left = canvasOpenHelpLeft;

    canvasOpenHelp.style.width = canvasOpenHelpWidthHeight;
    canvasOpenHelp.style.height = canvasOpenHelpWidthHeight;

    //set canvasHelper at bottom
    canvasHelp.style.bottom = "0px";
    //canvasHelpe for first time is hidden
    canvasHelp.style.height = "0px";
  }

  function createMeshes() {
    textureLoader = new THREE.TextureLoader(manager);

    skybox_group = new SkyDome(Paths.sky_dome, 1e9, textureLoader).addSkyDome();

    sunMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[0],
      PlanetScales.SUN_SCALE,
      true,
      false,
      null,
      null,
      null,
      SUN_INIT_POS_X,
      SUN_INIT_POS_Y,
      SUN_INIT_POS_Z,
      696.35, // SUN_SIZE, //sunRadius,
      widthSegments,
      heightSegments,
      true,
      false,
      null,
      null,
      PlanetsURL.SUN,
      null,
      null,
      0xffffff,
      MapKinds.mapKind[2],
      PlanetNames.SUN
    );
    ////////////////////MERCURY///////////////////////////////////

    mercuryMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[0],
      PlanetScales.MERCURY_SCALE,
      true,
      false,
      null,
      null,
      null,
      null, //mercuryCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //mercuryRadius,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.MERCURY_MAP,
      null,
      null,
      null,
      PlanetsURL.MERCURY_BUMP,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.MERCURY
    );

    venusMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[0],
      PlanetScales.VENUS_SCALE,
      true,
      false,
      null,
      null,
      null,
      0, //venusCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //venusRadius,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.VENUS_MAP,
      null,
      null,
      null,
      PlanetsURL.VENUS_BUMP,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.VENUS
    );

    earthMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.EARTH_SCALE,
      true,
      true,
      null,
      null,
      -0.401426,
      null, //earthCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //earthRadius,
      widthSegments,
      heightSegments,
      false,
      true,
      PlanetsURL.EARTH_MAP,
      PlanetsURL.EARTH_NORMAL_MAP,
      null,
      PlanetsURL.EARTH_SPECULAR_MAP,
      null,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[1] + MapKinds.mapKind[3],
      PlanetNames.EARTH
    );

    moonMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.MOON_SCALE,
      true,
      false,
      null,
      null,
      false,
      null, //moonCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //moonRadius,
      widthSegments,
      heightSegments,
      true,
      false,
      PlanetsURL.MOON_MAP,
      null,
      null,
      null,
      PlanetsURL.MOON_BUMP_MAP,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.MOON
    );

    //////////////////////////MARS///////////////////////////

    marsMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.MARS_SCALE,
      true,
      false,
      null,
      null,
      false,
      null, //marsCenterPosition,
      0,
      0,
      PlanetsConstSize.size,
      widthSegments,
      heightSegments,
      true,
      false,
      PlanetsURL.MARS_MAP,
      null,
      null,
      PlanetsURL.MARS_BUMP,
      null,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.MARS
    );

    jupyterMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.JUPYTER_SCALE,
      true,
      false,
      null,
      null,
      false,
      null, //jupyterCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //jupyterRadius,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.JUPYTER_MAP,
      null,
      null,
      null,
      null,
      null,
      MapKinds.mapKind[0],
      PlanetNames.JUPYTER
    );

    saturnMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.SATURN_SCALE,
      true,
      true,
      null,
      null,
      -0.471239,
      null, //saturnCenterPosition,
      0,
      0,
      PlanetsConstSize.size,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.SATURN_MAP,
      null,
      null,
      null,
      null,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.SATURN
    );

    saturnRingMesh = new CreatePlanet(textureLoader).setPlanetRing(
      PlanetsRings.SATURN,
      saturnRadius,
      1.5708,
      -0.45
    );

    uranusMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[1],
      PlanetScales.URANUS_SCALE,
      true,
      true,
      null,
      null,
      -1.706932,
      null, //uranusCenterPosition,
      0,
      0,
      PlanetsConstSize.size,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.URANUS_MAP,
      null,
      null,
      null,
      null,
      null,
      MapKinds.mapKind[0],
      PlanetNames.URANUS
    );

    uranusRingMesh = new CreatePlanet(textureLoader).setPlanetRing(
      PlanetsRings.URANUS,
      uranusRadius,
      1.5708,
      -1.706932 //97.8 degree
    );

    neptunoMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[1],
      PlanetScales.NEPTUNO_SCALE,
      true,
      true,
      null,
      null,
      -0.49410271, //97.8 degrees
      null, //neptunoCenterPosition,
      0,
      0,
      PlanetsConstSize.size, //neptunoRadius, //radius divided by 10.000
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.NEPTUNO_MAP,
      null,
      null,
      null,
      null,
      null,
      MapKinds.mapKind[0],
      PlanetNames.NEPTUNO
    );

    plutoMesh = new CreatePlanet(textureLoader).createPlanet(
      MeshsKinds.meshKind[2],
      PlanetScales.PLUTO_SCALE,
      true,
      true,
      null,
      null,
      0,
      null, //PlutoCenterPosi,
      0,
      0,
      PlanetsConstSize.size,
      widthSegments,
      heightSegments,
      false,
      false,
      PlanetsURL.PLUTO_MAP,
      null,
      null,
      null,
      PlanetsURL.PLUTO_BUMP_MAP,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.PLUTO
    );

    ///////////////////////////////////////////////////////////////

    scene.add(skybox_group);
    scene.add(sunMesh);

    scene.add(venusMesh);
    scene.add(mercuryMesh);
    earthMesh.add(moonMesh);
    earth_group_orbit.add(earthMesh);
    earth_group_orbit.name = PlanetNames.EARTH;
    // scene.add(earth_group_orbit);
    scene.add(earthMesh);
    scene.add(marsMesh);
    scene.add(jupyterMesh);
    scene.add(saturnMesh);
    scene.add(saturnRingMesh);
    scene.add(uranusMesh);
    scene.add(uranusRingMesh);
    scene.add(neptunoMesh);
    scene.add(plutoMesh);

    scene.remove(axesHelper);
  }

  function update() {
    if (SCALING_TIME !== 0) {
      playPlanet();
      getPlanetClick(scene);
    }
  }

  function getPlanetClick(sceneObject) {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(sceneObject.children);
    //
    if (!blockRun) {
      if (intersects.length > 0) {
        alert(intersects[0].object.name);
      } else {
        try {
          var intersects1 = raycaster.intersectObjects(earthMesh.children);
          alert(intersects1[0].object.name);
        } catch (e) {
          //If user clicks on space do nothing - intersects1 array get index OOR
        }
      }
    }
    blockRun = true;
  }

  function playPlanet() {
    AdjustPlanetLocation(mercuryMesh, planets[0]);

    AdjustPlanetLocation(venusMesh, planets[1]);

    AdjustPlanetLocation(earthMesh, planets[2]);

    AdjustPlanetLocation(moonMesh, planets[3]);

    AdjustPlanetLocation(marsMesh, planets[4]);
    AdjustPlanetLocation(jupyterMesh, planets[5]);

    AdjustPlanetLocation(saturnMesh, planets[6]);
    saturnRingMesh.position.x = saturnMesh.position.x;
    saturnRingMesh.position.y = saturnMesh.position.y;
    saturnRingMesh.position.z = saturnMesh.position.z;

    AdjustPlanetLocation(uranusMesh, planets[7]);
    uranusRingMesh.position.x = uranusMesh.position.x;
    uranusRingMesh.position.y = uranusMesh.position.y;
    uranusRingMesh.position.z = uranusMesh.position.z;

    AdjustPlanetLocation(neptunoMesh, planets[8]);
    AdjustPlanetLocation(plutoMesh, planets[9]);

    planetRotation();
  }

  // perform any updates to the scene, called once per frame
  // avoid heavy computation here
  function planetRotation() {
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

  // render, or 'draw a still image', of the scene
  function render() {
    renderer.render(scene, camera);
  }

  // a function that will be called every time the window gets resized.
  // It can get called a lot, so don't put any heavy computation in here!
  function onWindowResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    camera.updateProjectionMatrix();
    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function resetCameraPosition() {
    //r = reset camera position
    // console.log(controls);
    controls.reset();
    camera.position.set(
      cameraResetPosition[0],
      cameraResetPosition[1],
      cameraResetPosition[2]
    );
    SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
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
      if (SCALING_TIME === 0) {
        SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
        SCALING_TIME = dataControls.Orbit_Speed;
      } else {
        SIMULATION_SPEED_ORBIT = 0.0;
        SCALING_TIME = 0;
      }
    } else if (evt.keyCode === 82) {
      //r = reset camera position
      resetCameraPosition();
    } else if (evt.keyCode === 65) {
      //a

      camera.position.set(marsMesh.position.x, 20, marsMesh.position.z + 30);
      camera.lookAt(marsMesh.position);
    } else if (evt.keyCode === 74) {
      //Jupyter

      camera.position.set(
        jupyterMesh.position.x,
        20,
        jupyterMesh.position.z + 30
      );

      camera.lookAt(jupyterMesh.position);
    } else if (evt.keyCode === 77) {
      //tecla m
      camera.position.x = mercuryMesh.position.x;
      camera.position.y = 20;
      camera.position.z = mercuryMesh.position.z + 10;
      camera.lookAt(mercuryMesh.position);
    } else if (evt.keyCode === 78) {
      //tecla n

      camera.position.x = neptunoMesh.position.x;
      camera.position.y = 20;
      camera.position.z = neptunoMesh.position.z;
      camera.lookAt(neptunoMesh.position);
    } else if (evt.keyCode === 83) {
      //tecla s
      camera.position.x = saturnMesh.position.x - 10;
      camera.position.y = 20;
      camera.position.z = saturnMesh.position.z + 30;
      camera.lookAt(saturnMesh.position);
    } else if (evt.keyCode === 85) {
      //tecla u
      camera.position.x = uranusMesh.position.x;
      camera.position.y = 10;
      camera.position.z = uranusMesh.position.z + 20;
      camera.lookAt(uranusMesh.position);
    } else if (evt.keyCode === 86) {
      // tecla v

      camera.position.x = venusMesh.position.x;
      camera.position.y = 10;
      camera.position.z = venusMesh.position.z + 20;
      camera.lookAt(venusMesh.position);
    } else if (evt.keyCode === 69) {
      //tecla e

      camera.lookAt(
        earthMesh.position.x + 1350000,
        215000,
        earthMesh.position.z + 50000
      );
      camera.position.set(
        earthMesh.position.x + 2000000,
        215000,
        earthMesh.position.z + 50000
      );
      controls.target.set(
        earthMesh.position.x + 1350000,
        215000,
        earthMesh.position.z + 50000
      );

      SCALING_TIME = dataControls.Orbit_Speed;
    } else if (evt.keyCode === 188) {
      SCALING_TIME -= dataControls.Orbit_Speed;
    } else if (evt.keyCode === 190) {
      SCALING_TIME += dataControls.Orbit_Speed;
    }
  }

  function onMouseHelpIconOver() {
    //canvasHelpe is displayed. div css starts with opacity = 0
    canvasHelp.style.height = canvasHelpHeight;
    setOpacityAnime(60, true);
  }

  function onMouseHelpIconOut() {}

  function onformattedHelpOver() {
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

    var interval = setInterval(function () {
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

  function createSpeedMenu() {
    let dataLighting = {
      Ambient_Light: 0.02,
      Sun_Light: SunLight.intensity,
    };
    let visibleObjects = {
      Orbit_path: true,
    };
    let objectsHelper = {
      axisHelper: false,
    };

    var actions = new (function () {
      this.Reset_Scene = function () {
        resetCameraPosition();
      };
    })();

    var gui = new dat.GUI();

    //gui.remember(dataControls);

    var folderSpeed = gui.addFolder("Speed settings");
    folderSpeed
      .add(dataControls, "Rotation_Speed", 0, 3)
      .onChange(function (value) {
        SIMULATION_SPEED_ROTATION = value;
      });
    folderSpeed
      .add(dataControls, "Orbit_Speed", 0, 4000000)
      .onChange(function (value) {
        // SIMULATION_SPEED_ORBIT = value;
        SCALING_TIME = value;
      });
    folderSpeed.add(dataControls, "Stop_Animation").onChange(function (value) {
      if (value === true) {
        renderer.setAnimationLoop(null);
      } else {
        renderer.setAnimationLoop(() => {
          update();
          render();
        });
      }
    });
    folderSpeed.add(actions, "Reset_Scene");

    var folderSpeedLighting = gui.addFolder("Lighting settings");
    folderSpeedLighting
      .add(dataLighting, "Ambient_Light", 0, 2)
      .onChange(function (value) {
        ambientLight.intensity = value;
      });

    var folderSpeedSunLighting = gui.addFolder("Sun Light settings");
    folderSpeedSunLighting
      .add(dataLighting, "Sun_Light", 1, 7)
      .onChange(function (value) {
        // light.power = value * 1000 * 4 * Math.PI;
        light.power = value * 4 * Math.PI;
      });

    var folderVisibleObjects = gui.addFolder("Objects settings");
    folderVisibleObjects
      .add(visibleObjects, "Orbit_path")
      .onChange(function (value) {
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

    //X - RED  Y - GREEN  Z - BLUE
    var folderObjectsHelper = gui.addFolder("Objects Helper");
    folderObjectsHelper
      .add(objectsHelper, "axisHelper")
      .onChange(function (value) {
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

  function onMouseDown(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    blockRun = false;
  }
  window.addEventListener("mousedown", onMouseDown);

  // call the init function to set everything up
  init();
}

try {
  MAIN();
} catch (e) {
  console.log(e);
}
