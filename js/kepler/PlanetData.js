// Define some plantery data. This is used to calculate orbits according to Keplers laws.
// Package these as objects to make it more efficient...

const GRAV_CONSTANT = 6.674e-11;
const SECONDS_IN_YEAR = 3.15576e7;
const SUN_SIZE = 695;
const SUN_MASS = 1.989e30; // Kilograms
//const SUN_MASS = 5.97e24;
//var SCALING_TIME = 10.0;
const PLANET_SCALE = 10000;

//Prototype for planet objects. Encapsulates property and physics. Paired with 3d object.
// Update: Don't really need this anymore.
function Planet(
  size,
  mass,
  semimajor_axis,
  semiminor_axis,
  orbital_eccentricity,
  orbital_inclination,
  mean_anamoly_epoch
) {
  //This is for ES5 compatability in safari. Would prefer to use default parameters as ES6 defines it but Chrome/Firefox have basic support currently.
  if (mean_anamoly_epoch === undefined) {
    mean_anamoly_epoch = 0.0;
  }

  this.size = size;
  this.mass = mass;
  this.semimajor_axis = semimajor_axis;
  this.semiminor_axis = semiminor_axis;
  this.orbital_eccentricity = orbital_eccentricity;
  this.orbital_inclination = orbital_inclination;
  this.mean_anamoly_epoch = mean_anamoly_epoch * (Math.PI / 180);

  this.semimajor_axis_scene = function () {
    return this.semimajor_axis / PLANET_SCALE;
  };
  this.semiminor_axis_scene = function () {
    return this.semiminor_axis / PLANET_SCALE;
  };
  this.periapsis = function () {
    return this.semimajor_axis * (1 - this.orbital_eccentricity);
  };
  this.apoapsis = function () {
    return this.semimajor_axis * (1 + this.orbital_eccentricity);
  };
  this.periapsis_scene = function () {
    return this.periapsis() / PLANET_SCALE;
  };
  this.apoapsis_scene = function () {
    return this.apoapsis() / PLANET_SCALE;
  };

  this.eccentric_anamoly = function () {
    return KeplerSolve(
      this.orbital_eccentricity,
      CalculateMT(CalculateN(this.semimajor_axis))
    );
  };
  this.true_anamoly = function () {
    return (
      CalculateTrueAnamoly(
        this.eccentric_anamoly(),
        this.orbital_eccentricity,
        true
      ) + this.mean_anamoly_epoch
    );
  };
}

// Encapsulates all physical properties of the celestial body. Also handles rendering.
function Planet_Gen(planet_obj, render_group, showSpriteText) {
  //This is for ES5 compatability in safari. Would prefer to use default parameters as ES6 defines it but Chrome/Firefox have basic support currently.
  if (planet_obj.MEAN_ANAMOLY_EPOCH === undefined) {
    planet_obj.mean_anamoly_epoch = 0.0;
  }

  if (planet_obj.CENTRAL_MASS === undefined) {
    planet_obj.CENTRAL_MASS = SUN_MASS;
  }

  this.size = planet_obj.SIZE;
  this.mass = planet_obj.MASS;
  this.central_mass = planet_obj.CENTRAL_MASS;
  this.semimajor_axis = planet_obj.SEMIMAJOR_AXIS;
  this.semiminor_axis = planet_obj.SEMIMINOR_AXIS;
  this.orbital_eccentricity = planet_obj.ECCENTRICITY;
  this.orbital_inclination =
    planet_obj.HELIOCENTRIC_INCLINATION * (Math.PI / 180);
  this.longitude_ascending =
    planet_obj.LONGITUDE_ASCENDING_NODE * (Math.PI / 180);
  this.argument_periapsis = planet_obj.ARGUMENT_OF_PERIAPSIS * (Math.PI / 180);
  this.mean_anamoly_epoch = planet_obj.MEAN_ANAMOLY_EPOCH * (Math.PI / 180);
  this.name = String(planet_obj.BODY_NAME);
  this.parent_group = render_group;
  this.texture = planet_obj.TEXTURE;
  //Create 3D Object to be rendered, and add it to the THREE Object3d group.
  //this.parent_group.add(CreateSphere(this.texture, this.size, 50, this.name));
  //  this.parent_group.add(CreateTransparentSphere(TRANSPARENT_SPHERE_SIZE,50,TRANSPARENT_SPHERE_NAME));
  if (showSpriteText) {
    this.parent_group.add(
      CreateSpriteText(this.name, "#ffffff", this.name + "_text", this.size)
    );
  }

  // Scales down real values to simulation values and calculates periapsis and apoapsis from associated variables.
  this.semimajor_axis_scene = function () {
    return this.semimajor_axis / PLANET_SCALE;
  };
  this.semiminor_axis_scene = function () {
    return this.semiminor_axis / PLANET_SCALE;
  };
  this.periapsis = function () {
    return this.semimajor_axis * (1 - this.orbital_eccentricity);
  };
  this.apoapsis = function () {
    return this.semimajor_axis * (1 + this.orbital_eccentricity);
  };
  this.periapsis_scene = function () {
    return this.periapsis() / PLANET_SCALE;
  };
  this.apoapsis_scene = function () {
    return this.apoapsis() / PLANET_SCALE;
  };

  // This calls out to the main physics module and calculates the movement in the scene.
  this.eccentric_anamoly = function () {
    return KeplerSolve(
      this.orbital_eccentricity,
      CalculateMT(CalculateN(this.semimajor_axis, this.central_mass))
    );
  };
  this.true_anamoly = function () {
    return (
      CalculateTrueAnamoly(
        this.eccentric_anamoly(),
        this.orbital_eccentricity,
        true
      ) + this.mean_anamoly_epoch
    );
  };
}

function CreateSpriteText(text, colour, name, offset) {
  var SpriteText = new THREE_Text2D.SpriteText2D(text, {
    align: THREE_Text2D.textAlign.center,
    font: "30px Arial",
    fillStyle: colour,
    antialias: true,
  });
  SpriteText.position.set(0, offset + 100, 0);
  SpriteText.name = name;
  return SpriteText;
}

// Prototype of planet object. Should hopefully be able to upgrade this to a JSON screne description.
var Planet_Prototype = {
  SIZE: 0,
  SEMIMAJOR_AXIS: 0,
  SEMIMINOR_AXIS: 0,
  ECCENTRICITY: 0,
  MASS: 0,
  HELIOCENTRIC_INCLINATION: 0,
  LONGITUDE_ASCENDING_NODE: 0,
  ARGUMENT_OF_PERIAPSIS: 0,
  MEAN_ANAMOLY_EPOCH: 0,
  PLANET_NAME: "",
  PLANET_TEXTURE: "",
};

//LONGITUDE_ASCENDING_NODE: 48.33,
//   ARGUMENT_OF_PERIAPSIS: 77.45,
// ECCENTRICITY: 0.21

var Mercury_Info = {
  SIZE: 2.4,
  SEMIMAJOR_AXIS: 5.791e7,
  SEMIMINOR_AXIS: 5.667e7,
  ECCENTRICITY: 0.21,
  MASS: 3.285e23,
  HELIOCENTRIC_INCLINATION: 0.21,
  LONGITUDE_ASCENDING_NODE: 48.33,
  ARGUMENT_OF_PERIAPSIS: 77.45,
  MEAN_ANAMOLY_EPOCH: 252.25,
  BODY_NAME: "Mercury",
  MERCURYORBITRATING: 4.09, //# Mercury orbits the Sun about 3.7 degree per day. it takes about 88 solar days to orbit the sun  360/88 = 4.090909
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

//    LONGITUDE_ASCENDING_NODE: 76.68,
//    ARGUMENT_OF_PERIAPSIS: 131.53,
// ECCENTRICITY: 0.0067
var Venus_Info = {
  SIZE: 6,
  SEMIMAJOR_AXIS: 108.2089e6,
  SEMIMINOR_AXIS: 108.2064e6,
  ECCENTRICITY: 0.0067,
  MASS: 4.867e24,
  HELIOCENTRIC_INCLINATION: 0.0067,
  LONGITUDE_ASCENDING_NODE: 76.68,
  ARGUMENT_OF_PERIAPSIS: 131.53,
  MEAN_ANAMOLY_EPOCH: 181.98,
  BODY_NAME: "Venus",
  VENUSORBITRATING: 1.6, //# 225 dias solares. 360/225
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Earth_Info = {
  SIZE: 6.1,
  SEMIMAJOR_AXIS: 149.598e6,
  SEMIMINOR_AXIS: 149.577e6,
  ECCENTRICITY: 0.0167,
  MASS: 5.972e24,
  HELIOCENTRIC_INCLINATION: 7.155,
  LONGITUDE_ASCENDING_NODE: -11.26,
  ARGUMENT_OF_PERIAPSIS: 102.95,
  MEAN_ANAMOLY_EPOCH: 100.46,
  BODY_NAME: "Earth",
  EARTHORBITRATING: 1.0, //#Período Orbital : 360/365,256363004 = 0.999298   (Almost 1 degree per day)
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Moon_Info = {
  SIZE: 1.73,
  SEMIMAJOR_AXIS: 0.384e6,
  SEMIMINOR_AXIS: 0.3633e6,
  ECCENTRICITY: 0.0549,
  MASS: 0.07346e24,
  HELIOCENTRIC_INCLINATION: 5.145,
  LONGITUDE_ASCENDING_NODE: 0,
  ARGUMENT_OF_PERIAPSIS: 0,
  MEAN_ANAMOLY_EPOCH: 0,
  CENTRAL_MASS: 5.972e24,
  BODY_NAME: "Moon",
  MOONORBITINGRATING: 13.0, //#Período Orbital Lua : 27. 360/27
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Mars_Info = {
  SIZE: 3.4,
  SEMIMAJOR_AXIS: 227.937e6,
  SEMIMINOR_AXIS: 226.94e6,
  ECCENTRICITY: 0.0934,
  MASS: 6.417e24,
  HELIOCENTRIC_INCLINATION: 5.65,
  LONGITUDE_ASCENDING_NODE: 49.5785,
  ARGUMENT_OF_PERIAPSIS: 336.041,
  MEAN_ANAMOLY_EPOCH: 355.45,
  BODY_NAME: "Mars",
  MARSORBITRATING: 0.52, //#687 solar days
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Jupiter_Info = {
  SIZE: 69.9,
  SEMIMAJOR_AXIS: 778e6,
  SEMIMINOR_AXIS: 777.5e6,
  ECCENTRICITY: 0.049,
  MASS: 1.9e27,
  HELIOCENTRIC_INCLINATION: 6.09,
  LONGITUDE_ASCENDING_NODE: 100.56,
  ARGUMENT_OF_PERIAPSIS: 14.75,
  MEAN_ANAMOLY_EPOCH: 34.4,
  BODY_NAME: "Jupiter",
  JUPYTERORBITING: 0.08, //12 anos (12*365 = 4380dias) 360/4380 = 0.08219
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Saturn_Info = {
  SIZE: 58.2,
  SEMIMAJOR_AXIS: 1.427e9,
  SEMIMINOR_AXIS: 1.425e9,
  ECCENTRICITY: 0.0542,
  MASS: 5.683e26,
  HELIOCENTRIC_INCLINATION: 5.51,
  LONGITUDE_ASCENDING_NODE: 113.715,
  ARGUMENT_OF_PERIAPSIS: 92.43,
  MEAN_ANAMOLY_EPOCH: 49.94,
  BODY_NAME: "Saturn",
  SATURNORBITINGRATING: 0.03, //360 / 29ANOS(10585)
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Uranus_Info = {
  SIZE: 25.36,
  SEMIMAJOR_AXIS: 2.871e9,
  SEMIMINOR_AXIS: 2.8678e9,
  ECCENTRICITY: 0.047167,
  MASS: 8.68103e25,
  HELIOCENTRIC_INCLINATION: 6.48,
  LONGITUDE_ASCENDING_NODE: 74.23,
  ARGUMENT_OF_PERIAPSIS: 170.964,
  MEAN_ANAMOLY_EPOCH: 313.23,
  BODY_NAME: "Uranus",
  URANUSORBITINGRATING: 0.01, //360 / 84ANOS(30660)
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Neptune_Info = {
  SIZE: 24.62,
  SEMIMAJOR_AXIS: 4.495e9,
  SEMIMINOR_AXIS: 4.495e9,
  ECCENTRICITY: 0.00934,
  MASS: 1e26,
  HELIOCENTRIC_INCLINATION: 6.43,
  LONGITUDE_ASCENDING_NODE: 131.722,
  ARGUMENT_OF_PERIAPSIS: 44.97,
  MEAN_ANAMOLY_EPOCH: 304.88,
  BODY_NAME: "Neptune",
  NEPTUNOORBITINGRATING: 0.006, //360 / 165ANOS(60225)
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};

var Pluto_Info = {
  SIZE: 1.186,
  SEMIMAJOR_AXIS: 5.986e9,
  SEMIMINOR_AXIS: 5.7203e9,
  ECCENTRICITY: 0.2488,
  MASS: 1.3e22,
  HELIOCENTRIC_INCLINATION: 17,
  LONGITUDE_ASCENDING_NODE: 110.3,
  ARGUMENT_OF_PERIAPSIS: 224.067,
  MEAN_ANAMOLY_EPOCH: 0,
  BODY_NAME: "Pluto",
  TEXTURE_MAP: "",
  TEXTURE_BUMP_MAP: "",
  TEXTURE_NORMAL_MAP: "",
  TEXTURE_SPECULAR_MAP: "",
};
