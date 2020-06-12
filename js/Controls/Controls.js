var Controls = function createControls(
  camera,
  container,
  minDistance,
  maxDistance,
  enableRotate,
  autoRotate,
  cameraPan,
  rotateSpeed,
  zoomSpeed
) {
  var controls = new THREE.OrbitControls(camera, container);

  controls.enableRotate = enableRotate;
  controls.autoRotate = autoRotate;
  controls.cameraPan = cameraPan;
  controls.rotateSpeed = rotateSpeed;
  controls.zoomspeed = zoomSpeed;

  controls.minDistance = minDistance;
  controls.maxDistance = maxDistance; //3500 antes

  controls.update();
  return controls;
};

export { Controls };
