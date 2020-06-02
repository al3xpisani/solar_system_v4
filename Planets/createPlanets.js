import {
  MeshsKinds,
  MapKinds,
  PlanetsRings,
  PlanetsURL,
} from "../constants/Constants.js";

var CreatePlanet = function (textureLoader) {
  var mesh;

  this.drawEllipseOrbitPath = function (
    scene,
    planetCenterPosition,
    hexLineColor
  ) {
    var mesh;
    var curve = new THREE.EllipseCurve(
      0,
      0, // ax, aY
      planetCenterPosition,
      planetCenterPosition, // xRadius, yRadius
      0,
      2 * Math.PI, // aStartAngle, aEndAngle
      false, // aClockwise
      0 // aRotation
    );

    var points = curve.getPoints(100);
    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.LineBasicMaterial({ color: hexLineColor });

    // Create the final object to add to the scene
    var mesh = new THREE.Line(geometry, material);
    mesh.rotation.x = 1.5708; //rotaciona o eixo X na mesma direcao do eixo x dos planetas
    scene.add(mesh);

    return mesh;
  };

  this.setPlanetRing = function (planetName, radius, rotationx, rotationy) {
    //Draw Saturn Ring
    var satUraRingMesh;
    var satUraInnerRadius = radius + 1;
    var satUrOuterRadius = radius + 5;
    var satUrThetaSegments = 60;

    const satUraRingGeometry = new THREE.RingBufferGeometry(
      satUraInnerRadius,
      satUrOuterRadius,
      satUrThetaSegments
    );

    var pos = satUraRingGeometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      satUraRingGeometry.attributes.uv.setXY(
        i,
        v3.length() < satUraInnerRadius + 1 ? 0 : 1,
        1
      );
    }

    var satUraRingMaterial;

    if (planetName === PlanetsRings.SATURN) {
      satUraRingMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(PlanetsURL.SATURN_RING_MAP),
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
    } else {
      //URANUS
      satUraRingMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(PlanetsURL.URANUS_RING_MAP),
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
    }

    satUraRingMesh = new THREE.Mesh(satUraRingGeometry, satUraRingMaterial);
    satUraRingMesh.rotation.x = rotationx; //rotaciona o eixo X na mesma direcao do eixo x dos planetas
    satUraRingMesh.rotation.y = rotationy;

    return satUraRingMesh;
  };

  this.createPlanet = function (
    meshKind,
    setInitPos = false,
    setRotation = false,
    rotationx,
    rotationy,
    rotationz,
    planetPosX,
    planetPosY,
    planetPosZ,
    radius,
    widthSegments,
    heightSegments,
    castShadow,
    receiveShadow,
    planetTextureMap,
    planetTextureNormalMap,
    planetTextureEmissiveMap,
    planetTextureSpecularMap,
    planetTextureBumpMap,
    emissiveColor,
    mapKind
  ) {
    const planetSphere = new THREE.SphereBufferGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    var planetTextureMapLoader;
    var planetTextureNormalMapLoader;
    var planetTextureSpecularMapLoader;
    var planetTextureEmissiveMapLoader;
    var planetTextureBumpMapLoader;

    if (mapKind === MapKinds.mapKind[0]) {
      //map
      planetTextureMapLoader = textureLoader.load(planetTextureMap);
    } else if (mapKind === MapKinds.mapKind[2]) {
      //emissive
      planetTextureEmissiveMapLoader = textureLoader.load(
        planetTextureEmissiveMap
      );

      planetTextureEmissiveMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureEmissiveMapLoader.anisotropy = 16;
    } else if (mapKind === MapKinds.mapKind[0] + MapKinds.mapKind[4]) {
      //map + bumpMap
      planetTextureMapLoader = textureLoader.load(planetTextureMap);
      planetTextureBumpMapLoader = textureLoader.load(planetTextureBumpMap);

      planetTextureMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureMapLoader.anisotropy = 16;
      planetTextureBumpMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureBumpMapLoader.anisotropy = 16;
    } else if (
      mapKind ===
      MapKinds.mapKind[0] + MapKinds.mapKind[1] + MapKinds.mapKind[3]
    ) {
      //map + normalMap + specularMap
      planetTextureMapLoader = textureLoader.load(planetTextureMap);
      planetTextureNormalMapLoader = textureLoader.load(planetTextureNormalMap);
      planetTextureSpecularMapLoader = textureLoader.load(
        planetTextureSpecularMap
      );
      planetTextureMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureMapLoader.anisotropy = 16;
      planetTextureNormalMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureNormalMapLoader.anisotropy = 16;
      planetTextureSpecularMapLoader.encoding = THREE.sRGBEncoding;
      planetTextureSpecularMapLoader.anisotropy = 16;
    }

    var planetMaterial;

    if (meshKind === MeshsKinds.meshKind[0]) {
      //MeshStandardMaterial
      if (mapKind === MapKinds.mapKind[2]) {
        //emissive
        planetMaterial = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          emissive: emissiveColor,
          emissiveMap: planetTextureEmissiveMapLoader,
          roughness: 1,
          normalScale: new THREE.Vector2(4, 4),
        });
      } else if (mapKind === MapKinds.mapKind[0] + MapKinds.mapKind[4]) {
        //map + bumpMap
        planetMaterial = new THREE.MeshStandardMaterial({
          map: planetTextureMapLoader,
          bumpMap: planetTextureBumpMapLoader,
          bumpScale: 0.002,
          roughness: 1,
        });
      }
    } else if (meshKind === MeshsKinds.meshKind[1]) {
      //MeshBasicMaterial
      if (mapKind === MapKinds.mapKind[0]) {
        //map
        planetMaterial = new THREE.MeshBasicMaterial({
          map: planetTextureMapLoader,
        });
      }
    } else if (meshKind === MeshsKinds.meshKind[2]) {
      //MeshPhongMaterial
      if (
        mapKind ===
        MapKinds.mapKind[0] + MapKinds.mapKind[1] + MapKinds.mapKind[3]
      ) {
        //map + normalMap +  specularMap
        var planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
          normalMap: planetTextureNormalMapLoader,
          specularMap: planetTextureSpecularMapLoader,
          normalScale: new THREE.Vector2(6, 6),
          specular: new THREE.Color("grey"),
        });
      } else if (mapKind === MapKinds.mapKind[0] + MapKinds.mapKind[4]) {
        //map + bumpMap
        planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
          bumpMap: planetTextureBumpMapLoader,
          bumpScale: 0.002,
        });
      } else if (mapKind === MapKinds.mapKind[0]) {
        //map
        planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
        });
      }
    }

    mesh = new THREE.Mesh(planetSphere, planetMaterial);
    if (castShadow) mesh.castShadow = castShadow;
    if (receiveShadow) mesh.receiveShadow = receiveShadow;

    if (setInitPos) mesh.position.set(planetPosX, planetPosY, planetPosZ);
    if (setRotation) {
      if (rotationz) {
        mesh.rotation.z = rotationz;
      }
    }

    return mesh;
  };
};

export { CreatePlanet };
