const Paths = {
  sky_dome: "../textures/eso_dark.jpg",
};

const OrbitRadiusMultiplier = {
  Orbit_Radius_Multiplier: 100,
};

const PlanetsConstSize = {
  size: 5,
};

var scale = 5000;
//all values below multiplied by 10.000
const PlanetScales = {
  SUN_SCALE: 100,
  MERCURY_SCALE: scale * Mercury_Info.SIZE,
  VENUS_SCALE: scale * Venus_Info.SIZE,
  EARTH_SCALE: scale * Earth_Info.SIZE,
  MOON_SCALE: scale * Moon_Info.SIZE,
  MARS_SCALE: scale * Mars_Info.SIZE,
  JUPYTER_SCALE: scale * Jupiter_Info.SIZE,
  SATURN_SCALE: scale * Saturn_Info.SIZE,
  URANUS_SCALE: scale * Uranus_Info.SIZE,
  NEPTUNO_SCALE: scale * Neptune_Info.SIZE, //needs a extra size to be clear visible
  PLUTO_SCALE: 1,
};

const PlanetsRings = {
  URANUS: "URANUS",
  SATURN: "SATURN",
};

const MeshsKinds = {
  meshKind: ["MeshStandardMaterial", "MeshBasicMaterial", "MeshPhongMaterial"],
};

const MapKinds = {
  mapKind: ["map", "normalMap", "emissiveMap", "specularMap", "bumpMap"],
};

const PlanetsURL = {
  SUN: "https://i.ibb.co/3srcxqp/Sol.jpg",
  MERCURY_MAP: "https://i.ibb.co/Z2qdm1M/2k-mercury.jpg",
  MERCURY_BUMP: "https://i.ibb.co/2cXm7Ld/mercurybump.jpg",
  VENUS_MAP: "https://i.ibb.co/pPPFV0R/venusmap.jpg",
  VENUS_BUMP: "https://i.ibb.co/Gtw6t8x/venusbump.jpg",
  EARTH_NORMAL_MAP: "https://i.ibb.co/SBLFSV0/Earth-Normal.png",
  EARTH_MAP: "https://i.ibb.co/M8wzz6b/Earth.png",
  EARTH_SPECULAR_MAP: "https://i.ibb.co/LgKKt9G/Earth-Spec.png",
  MOON_MAP: "https://i.ibb.co/2cHJLGh/moonmap1k.jpg",
  MOON_BUMP_MAP: "https://i.ibb.co/7vDSSZz/moonbump1k.jpg",
  MARS_MAP: "https://i.ibb.co/q1XsgSB/marsmap1k.jpg",
  MARS_BUMP: "https://i.ibb.co/QMyJ17w/marsbump1k.jpg",
  JUPYTER_MAP: "https://i.ibb.co/rmJWC8m/jupitermap.jpg",
  SATURN_MAP: "https://i.ibb.co/HqgCYCD/saturnmap.jpg",
  SATURN_RING_MAP: "https://i.ibb.co/LQwTkmy/saturnringpattern.gif",
  URANUS_MAP: "https://i.ibb.co/SsPvzx0/uranusmap.jpg",
  URANUS_RING_MAP: "https://i.ibb.co/RHdh0ym/uranusringtrans.gif",
  NEPTUNO_MAP: "https://i.ibb.co/DtfRtw5/neptunemap.jpg",
};

const PlanetNames = {
  SUN: "SUN",
  MERCURY: "MERCURY",
  VENUS: "VENUS",
  EARTH: "EARTH",
  MOON: "MOON",
  MARS: "MARS",
  JUPYTER: "JUPYTER",
  SATURN: "SATURN",
  URANUS: "URANUS",
  NEPTUNO: "NEPTUNO",
  PLUTO: "PLUTO",
};

export {
  Paths,
  PlanetsURL,
  MeshsKinds,
  MapKinds,
  PlanetsRings,
  PlanetNames,
  OrbitRadiusMultiplier,
  PlanetScales,
  PlanetsConstSize,
};
