var Camera = function createCamera(
  container,
  fov,
  nearClip,
  farClip,
  startx,
  starty,
  startz
) {
  var camera = new THREE.PerspectiveCamera(
    fov, // FOV
    container.clientWidth / container.clientHeight, // aspect
    nearClip, // near clipping plane
    farClip // far clipping plane,
  );

  // var helper = new THREE.CameraHelper(camera);
  // scene.add(helper);
  // compute a target direction

  camera.position.set(startx, starty, startz);
  return camera;
};

export { Camera };
