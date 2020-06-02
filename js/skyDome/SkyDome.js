var SkyDome = function (texture, sphereSize, textureLoader) {
  var skyBoxMesh;

  this.addSkyDome = function () {
    // Create skydome.
    var skybox_group = new THREE.Object3D();
    const skyTexture = textureLoader.load(texture);
    skyTexture.encoding = THREE.sRGBEncoding;
    skyTexture.anisotropy = 16;

    const skySphere = new THREE.SphereGeometry(sphereSize, 50, 50);

    const skyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: skyTexture,
    });
    skyBoxMesh = new THREE.Mesh(skySphere, skyMaterial);
    skyBoxMesh.rotation.x = (Math.PI / 180) * 63;

    skybox_group.add(skyBoxMesh);
    return skybox_group;
  };

  this.getSkyBoxMesh = function () {
    return skyBoxMesh;
  };
};

export { SkyDome };
