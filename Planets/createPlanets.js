import { MeshsKinds, MapKinds } from "../constants/Constants.js";

var CreatePlanet = function (textureLoader) {
  var mesh;

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

    if (mapKind === MapKinds.mapKind[2]) {
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
        var planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
          bumpMap: planetTextureBumpMapLoader,
          bumpScale: 0.002,
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
