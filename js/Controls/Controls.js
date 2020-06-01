var Controls = function createControls(
  camera,
  container,
  minDistance,
  maxDistance,
  enableRotate,
  autoRotate,
  cameraPan,
  rotateSpeed
) {
  var controls = new THREE.OrbitControls(camera, container);

  controls.enableRotate = enableRotate;
  controls.autoRotate = autoRotate;
  controls.cameraPan = cameraPan;
  controls.rotateSpeed = rotateSpeed;

  controls.minDistance = minDistance;
  controls.maxDistance = maxDistance; //3500 antes

  controls.update();
  return controls;
};

export { Controls };
