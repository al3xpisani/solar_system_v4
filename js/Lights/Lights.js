import { Lensflare, LensflareElement } from "../Lensflare.js";

var Lights = function (scene) {
  this.ambientLight = function (color, intensity) {
    //I added HemisphereLight so we can see the dark side of the planets
    //Without these additional lights we cannot see anything (only black)

    var ambientLight = new THREE.AmbientLight(color, intensity);
    scene.add(ambientLight);

    return ambientLight;
  };

  this.lightFromSun = function (
    color,
    intensity,
    distance,
    decay,
    lightPositionX,
    lightPositionY,
    lightPositionZ,
    castShadow
  ) {
    //create directional light
    //These light goes in the center of the sun to shine all directions
    var light2;
    light2 = new THREE.PointLight(color, intensity, distance, decay);
    //move light
    light2.name = "SUNLIGHT";
    light2.distance = distance;
    light2.decay = decay;
    // light2.position.set(lightPositionX, lightPositionY, lightPositionZ);
    light2.castShadow = castShadow; // default false
    light2.visible = true;
    light2.shadow.bias = 0.0001;
    light2.shadow.mapSize.width = 4096; // default
    light2.shadow.mapSize.height = 4096; // default
    light2.shadow.darkness = 0.1;
    light2.shadow.camera.near = 1000000;
    light2.shadow.camera.far = 3e9; // default
    // light2.color.setHSL(0.5, 0.7, 0.8);

    //shadow.camera.fov and rotation shows the shadow.
    // light2.shadow.camera.fov = -270;
    // light2.rotation.set(0, Math.PI, 0);

    // h — matiz value between 0.0 and 1.0
    // s — saturation value between 0.0 and 1.0
    // l — lightness value between 0.0 and 1.0

    var textureLoader = new THREE.TextureLoader();

    var textureFlare0 = textureLoader.load(
      "./textures/lens_flare/lensflare0.png"
    );
    var textureFlare1 = textureLoader.load(
      "./textures/lens_flare/lensflare2.png"
    );
    var textureFlare2 = textureLoader.load(
      "./textures/lens_flare/lensflare3.png"
    );

    var lensflare = new Lensflare();

    lensflare.addElement(
      new LensflareElement(textureFlare0, 128, 0.6),
      THREE.AdditiveBlending
    );
    lensflare.addElement(
      new LensflareElement(textureFlare1, 256, 0),
      THREE.AdditiveBlending
    );
    lensflare.addElement(
      new LensflareElement(textureFlare2, 60, 0.6),
      THREE.AdditiveBlending
    );
    lensflare.addElement(
      new LensflareElement(textureFlare2, 70, 0.7),
      THREE.AdditiveBlending
    );
    lensflare.addElement(
      new LensflareElement(textureFlare2, 120, 0.9),
      THREE.AdditiveBlending
    );
    lensflare.addElement(
      new LensflareElement(textureFlare2, 70, 1),
      THREE.AdditiveBlending
    );
    lensflare.position.set(lightPositionX, lightPositionY, lightPositionZ);

    light2.add(lensflare);

    scene.add(light2);

    return light2;
  };

  this.axesHelper = function (width) {
    // The X axis is red. The Y axis is green. The Z axis is blue.
    var axesHelper = new THREE.AxesHelper(width);
    scene.add(axesHelper);
    return axesHelper;
  };

  //Create a helper for the shadow camera (optional)
  // var helper = new THREE.CameraHelper(light2.shadow.camera);
  // scene.add(helper);
};

export { Lights };
