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
} from "../constants/Constants.js";
import {
  CreatePlanet,
  AdjustPlanetLocation,
} from "../Planets/createPlanets.js";

var manager;
var Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto;
var planets = [];
var orbit_outlines = new THREE.Object3D();

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
  let showSpriteText = false;

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

  const widthSegments = 96;
  const heightSegments = 96;

  function init() {
    createSpeedMenu();

    scene = new THREE.Scene();

    camera = new Camera(container, 60, 0.1, 3e9, -3500, 3800, -5500);

    controls = new Controls(
      camera,
      container,
      98300,
      0.8e9,
      true,
      false,
      true,
      1.0
    );

    ambientLight = new Lights(scene).ambientLight(0xffffff, 0.4);
    // light[0] = new Lights(scene).light(0xffffff, 14000, 0, 2, 0, 0, 0, true);
    // light[0] = new Lights(scene).lightFromSun(
    //   0xfffff,
    //   10e22,
    //   0,
    //   2,
    //   0,
    //   0,
    //   0,
    //   true
    // );
    light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(1, 0, 0).normalize();
    light.color.setHSL(0.1, 0.7, 0.5);
    light.position.multiplyScalar(30);
    light.castShadow = true;

    light.target.position.copy(camera.position);

    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
    scene.add(light);

    axesHelper = new Lights(scene).axesHelper(1000);

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
    Mercury = new Planet_Gen(Mercury_Info, mercuryMesh, false);
    Venus = new Planet_Gen(Venus_Info, venusMesh, false);
    Earth = new Planet_Gen(Earth_Info, earthMesh, showSpriteText);
    Mars = new Planet_Gen(Mars_Info, marsMesh, showSpriteText);
    Moon = new Planet_Gen(Moon_Info, moonMesh, false);
    Jupiter = new Planet_Gen(Jupiter_Info, jupyterMesh, showSpriteText);
    Saturn = new Planet_Gen(Saturn_Info, saturnMesh, showSpriteText);
    Uranus = new Planet_Gen(Uranus_Info, uranusMesh, showSpriteText);
    Neptune = new Planet_Gen(Neptune_Info, neptunoMesh, false);
    //Pluto = new Planet_Gen(Pluto_Info, plutoMesh);
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
    // var mercuryCenterPosition =
    //   SUN_INIT_POS_X +
    //   SUNSCALE_RADIUS +
    //   mercuryRadius +
    //   MERCURY_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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
      true,
      PlanetsURL.MERCURY_MAP,
      null,
      null,
      null,
      PlanetsURL.MERCURY_BUMP,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.MERCURY
    );
    //draw planet orbit line
    // mercuryoOrbitPathMesh = new CreatePlanet(
    //   textureLoader
    // ).drawEllipseOrbitPath(scene, mercuryCenterPosition, 0xffffff);
    //mercuryAstronomicalUnitFactor = mercuryCenterPosition;

    ///////////////VENUS////////////////////////////////////////
    // let venusCenterPosition =
    //   mercuryMesh.position.x +
    //   mercuryRadius +
    //   venusRadius +
    //   VENUS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw planet orbit line
    // venusOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   venusCenterPosition,
    //   0xffffff
    // );
    // venusAstronomicalUnitFactor = venusCenterPosition;

    ///////////////EARTH////////////////////////////////////////

    // let earthCenterPosition =
    //   venusMesh.position.x +
    //   venusRadius +
    //   earthRadius +
    //   EARTH_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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
      false,
      PlanetsURL.EARTH_MAP,
      PlanetsURL.EARTH_NORMAL_MAP,
      null,
      PlanetsURL.EARTH_SPECULAR_MAP,
      null,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[1] + MapKinds.mapKind[3],
      PlanetNames.EARTH
    );

    //draw earth orbit line
    // earthOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   earthCenterPosition,
    //   0xffffff
    // );
    // earthAstronomicalUnitFactor = earthCenterPosition;

    /////////////////MOON//////////////////////////////////////////
    // let moonCenterPosition =
    //   earthMesh.position.x + earthRadius * 2 + MOON_DISTFROM_EARTH_UA;

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
      PlanetsURL.MOON_BUMP_MAP,
      null,
      null,
      MapKinds.mapKind[0] + MapKinds.mapKind[4],
      PlanetNames.MOON
    );
    //moonAstronomicalUnitFactor = earthRadius * 2 + MOON_DISTFROM_EARTH_UA;

    //////////////////////////MARS///////////////////////////

    // let marsCenterPosition =
    //   earthMesh.position.x +
    //   earthRadius +
    //   marsRadius +
    //   MARS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw earth orbit line
    // marsOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   marsCenterPosition,
    //   0xffffff
    // );
    // marsAstronomicalUnitFactor = marsCenterPosition;

    //////////////////////////JUPYTER///////////////////////////

    // let jupyterCenterPosition =
    //   marsMesh.position.x +
    //   marsRadius +
    //   jupyterRadius +
    //   JUPYTER_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw earth orbit line
    // jupyterOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   jupyterCenterPosition,
    //   0xffffff
    // );
    // jupyterAstronomicalUnitFactor = jupyterCenterPosition;

    //////////////////////////SATURN ///////////////////////////

    // let saturnCenterPosition =
    //   jupyterMesh.position.x +
    //   jupyterRadius +
    //   saturnRadius +
    //   SATURN_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw saturn orbit line
    // saturnOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   saturnCenterPosition,
    //   0xffffff
    // );
    // saturnAstronomicalUnitFactor = saturnCenterPosition;
    // saturnRingMesh.position.x = saturnMesh.position.x;

    //////////////////////////URANUS ///////////////////////////

    // let uranusCenterPosition =
    //   saturnMesh.position.x +
    //   saturnRadius +
    //   uranusRadius +
    //   URANUS_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw uranus orbit line
    // uranusOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   uranusCenterPosition,
    //   0xffffff
    // );
    // uranusAstronomicalUnitFactor = uranusCenterPosition;
    // uranusRingMesh.position.x = uranusMesh.position.x;

    //////////////////////////NEPTUNO ///////////////////////////

    // let neptunoCenterPosition =
    //   uranusMesh.position.x +
    //   uranusRadius +
    //   neptunoRadius +
    //   NEPTUNO_DISTFROM_SUN_UA * REALLITYSCALEFACTOR_UA_DIST;

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

    //draw neptuno orbit line
    // neptunoOrbitPathMesh = new CreatePlanet(textureLoader).drawEllipseOrbitPath(
    //   scene,
    //   neptunoCenterPosition,
    //   0xffffff
    // );
    // neptunoAstronomicalUnitFactor = neptunoCenterPosition;

    ///////////////////////////////////////////////////////////////

    scene.add(skybox_group);
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

  function update() {
    SCALING_TIME = dataControls.Orbit_Speed;

    AdjustPlanetLocation(mercuryMesh, planets[0]);

    AdjustPlanetLocation(venusMesh, planets[1]);

    AdjustPlanetLocation(earthMesh, planets[2]);

    AdjustPlanetLocation(moonMesh, planets[3]);

    AdjustPlanetLocation(marsMesh, planets[4]);
    AdjustPlanetLocation(jupyterMesh, planets[5]);

    AdjustPlanetLocation(saturnMesh, planets[6]);
    AdjustPlanetLocation(uranusMesh, planets[7]);
    AdjustPlanetLocation(neptunoMesh, planets[8]);

    sunMesh.rotation.y += 0.0005;
  }

  // perform any updates to the scene, called once per frame
  // avoid heavy computation here
  function update1() {
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
    camera.position.set(-35, 38, -55);
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
      if (SIMULATION_SPEED_ORBIT === 0.0) {
        SIMULATION_SPEED_ORBIT = dataControls.Orbit_Speed;
      } else {
        SIMULATION_SPEED_ORBIT = 0.0;
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

      camera.position.x = earthMesh.position.x + 10;
      camera.position.y = 10;
      camera.position.z = earthMesh.position.z;
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
      Ambient_Light: 0.4,
      Sun_Light: 14,
    };
    let visibleObjects = {
      Orbit_path: true,
    };
    let objectsHelper = {
      axisHelper: true,
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
      .add(dataControls, "Orbit_Speed", 0, 40000)
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
      .add(dataLighting, "Ambient_Light", 0, 1)
      .onChange(function (value) {
        ambientLight.intensity = value;
      });

    var folderSpeedSunLighting = gui.addFolder("Sun Light settings");
    folderSpeedSunLighting
      .add(dataLighting, "Sun_Light", 1, 24)
      .onChange(function (value) {
        light.power = value * 1000 * 4 * Math.PI;
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

  // call the init function to set everything up
  init();
}

try {
  //window.onload = function () {
  MAIN();
  //};
} catch (e) {
  console.log(e);
}
