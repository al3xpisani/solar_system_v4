import {
  MeshsKinds,
  MapKinds,
  PlanetsRings,
  PlanetsURL,
  OrbitRadiusMultiplier,
  PlanetNames,
} from "../constants/Constants.js";

var AdjustPlanetLocation = function (group, planet) {
  //var y = planet.semimajor_axis_scene()*Math.sin(planet.orbital_inclination*(Math.PI/180)) * Math.sin(planet.true_anamoly());
  var scale = OrbitRadiusMultiplier.Orbit_Radius_Multiplier;

  //A lua por ser satélite da Terra, recebe uma escala de posição diferente pois no
  //scene.add a lua já foi adicionada pela Terra
  if (planet.name.toUpperCase() === PlanetNames.MOON) {
    scale = 4;
  }
  var R =
    (planet.semimajor_axis_scene() *
      (1 - Math.pow(planet.orbital_eccentricity, 2))) /
    (1 +
      planet.orbital_eccentricity *
        Math.cos(planet.true_anamoly() + planet.argument_periapsis));
  group.position.y =
    R *
    Math.sin(planet.orbital_inclination) *
    Math.sin(planet.true_anamoly() + planet.argument_periapsis) *
    scale;
  group.position.x =
    R *
    (Math.cos(planet.longitude_ascending) *
      Math.cos(planet.true_anamoly() + planet.argument_periapsis) -
      Math.sin(planet.longitude_ascending) *
        Math.sin(planet.true_anamoly() + planet.argument_periapsis)) *
    Math.cos(planet.orbital_inclination) *
    scale;
  group.position.z =
    R *
    (Math.sin(planet.longitude_ascending) *
      Math.cos(planet.true_anamoly() + planet.argument_periapsis) +
      Math.cos(planet.longitude_ascending) *
        Math.sin(planet.true_anamoly() + planet.argument_periapsis)) *
    Math.cos(planet.orbital_inclination) *
    scale;
  // return group;

  // if (group.name === "MOON") {
  //   console.log("R", R);
  //   console.log("group.position.x", group.position.x);
  //   console.log("group.position.y", group.position.y);
  //   console.log("group.position.z", group.position.z);
  //   console.log("planet.semimajor_axis_scene", planet.semimajor_axis_scene());
  //   console.log(
  //     "planet.planet.orbital_eccentricity",
  //     planet.orbital_eccentricity
  //   );
  //   console.log("planet.planet.true_anamoly()", planet.true_anamoly());
  //   console.log("planet.argument_periapsis", planet.argument_periapsis);
  //   console.log("planet.orbital_inclination", planet.orbital_inclination);
  //   console.log("planet.longitude_ascending", planet.longitude_ascending);
  // }
};

var CreatePlanet = function (textureLoader) {
  this.setOrbitalPlanetLine = function (planets) {
    var orbit_outLines = new THREE.Object3D();

    for (var index = 0; index < planets.length; index++) {
      if (index !== 3) {
        //different from moon
        orbit_outLines.add(
          CreateOrbitalLine(
            planets[index].semimajor_axis_scene(),
            planets[index].semiminor_axis_scene(),
            planets[index].periapsis_scene(),
            planets[index].orbital_inclination,
            planets[index].longitude_ascending,
            planets[index].argument_periapsis,
            planets[index].orbital_eccentricity
          )
        );
      }
    }
    return orbit_outLines;
  };

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

    satUraRingMesh.scale.x = 445500;
    satUraRingMesh.scale.y = 445500;
    satUraRingMesh.scale.z = 445500;

    return satUraRingMesh;
  };

  this.createPlanet = function (
    meshKind,
    planetScale,
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
    mapKind,
    planetName
  ) {
    var planetSphere = new THREE.SphereBufferGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    var planetTextureMapLoader;
    var planetTextureNormalMapLoader;
    var planetTextureSpecularMapLoader;
    var planetTextureEmissiveMapLoader;
    var planetTextureBumpMapLoader;

    var mesh;
    var planetMaterial;

    if (mapKind === MapKinds.mapKind[0]) {
      //map
      planetTextureMapLoader = textureLoader.load(planetTextureMap);
    } else if (mapKind === MapKinds.mapKind[2]) {
      //emissive
      planetTextureEmissiveMapLoader = textureLoader.load(
        planetTextureEmissiveMap
      );
    } else if (mapKind === MapKinds.mapKind[0] + MapKinds.mapKind[4]) {
      //map + bumpMap
      planetTextureMapLoader = textureLoader.load(planetTextureMap);
      planetTextureBumpMapLoader = textureLoader.load(planetTextureBumpMap);
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
    }
    textureLoader.anisotropy = 16;
    textureLoader.encoding = THREE.sRGBEncoding;

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

        planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
          normalMap: planetTextureNormalMapLoader,
          specularMap: planetTextureSpecularMapLoader,
          normalScale: new THREE.Vector2(6, 6),
          specular: new THREE.Color("gray"),
          shininess: 5,
        });
      } else if (mapKind === MapKinds.mapKind[0] + MapKinds.mapKind[4]) {
        //map + bumpMap
        planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
          bumpMap: planetTextureBumpMapLoader,
          bumpScale: 0.002,
          shininess: 5,
        });
      } else if (mapKind === MapKinds.mapKind[0]) {
        //map
        planetMaterial = new THREE.MeshPhongMaterial({
          map: planetTextureMapLoader,
        });
      }
    }

    mesh = new THREE.Mesh(planetSphere, planetMaterial);

    if (castShadow === true) {
      mesh.castShadow = castShadow;
    }

    if (receiveShadow === true) {
      mesh.receiveShadow = receiveShadow;
    }

    // if (setInitPos) mesh.position.set(planetPosX, planetPosY, planetPosZ);

    if (setRotation) {
      if (rotationz) {
        mesh.rotation.z = rotationz;
      }
    }
    if (planetScale) {
      if (planetName !== PlanetNames.MOON) {
        mesh.scale.x = planetScale;
        mesh.scale.y = planetScale;
        mesh.scale.z = planetScale;
      } else {
        mesh.scale.x = 0.3;
        mesh.scale.y = 0.3;
        mesh.scale.z = 0.3;
      }
    }
    mesh.name = planetName;
    return mesh;
  };
};

function generateShadowTexture() {
  var canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;

  var context = canvas.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 1, 2, 1);

  return canvas;
}

function CreateOrbitalLine(
  semimajor_axis,
  semiminor_axis,
  periapsis,
  orbital_inclination,
  longitude_ascending,
  argument_periapsis,
  eccentricity
) {
  var linematerial = new THREE.LineBasicMaterial({ color: 0x7c7c7c });
  var linegeometry = new THREE.Geometry();

  for (var i = 0; i < 2 * Math.PI + 0.02; i = i + 0.01) {
    var R =
      (semimajor_axis * (1 - Math.pow(eccentricity, 2))) /
      (1 + eccentricity * Math.cos(i + argument_periapsis));
    var y =
      R *
      Math.sin(i + argument_periapsis) *
      Math.sin(orbital_inclination) *
      OrbitRadiusMultiplier.Orbit_Radius_Multiplier;
    var x =
      R *
      (Math.cos(longitude_ascending) * Math.cos(i + argument_periapsis) -
        Math.sin(longitude_ascending) * Math.sin(i + argument_periapsis)) *
      Math.cos(orbital_inclination) *
      OrbitRadiusMultiplier.Orbit_Radius_Multiplier;
    var z =
      R *
      (Math.sin(longitude_ascending) * Math.cos(i + argument_periapsis) +
        Math.cos(longitude_ascending) * Math.sin(i + argument_periapsis)) *
      Math.cos(orbital_inclination) *
      OrbitRadiusMultiplier.Orbit_Radius_Multiplier;
    linegeometry.vertices.push(new THREE.Vector3(x, y, z));
  }
  //console.log("x+y+z", x, y, z);
  var orbitline = new THREE.Line(linegeometry, linematerial);
  return orbitline;
}

export { CreatePlanet, AdjustPlanetLocation };
