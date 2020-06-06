var Renderer = function (container) {
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: false,
    alpha: true,
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  //Influencia na coloração da imagem de fundo
  // renderer.gammaFactor = 2.1;
  // renderer.outputEncoding = THREE.GammaEncoding;
  // renderer.gammaOutput = true;

  // renderer.toneMapping = THREE.ReinhardToneMapping;

  renderer.physicallyCorrectLights = true;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  return renderer;
};

export { Renderer };
