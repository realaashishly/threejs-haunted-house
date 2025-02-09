import { OrbitControls, Sky, Timer } from "three/examples/jsm/Addons.js";
import "./style.css";
import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.y = 3;
camera.position.z = 15;

// Light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.01);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#86cdff", 0.1);
directionalLight.position.set(0, 8, -8);
scene.add(directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Load Textures
const textureLoader = new THREE.TextureLoader();

// FLOOR
const floorAlpha = textureLoader.load("./soil/alphafloor.jpg");
const floorAoMapTexture = textureLoader.load(
    "./soil/coast_sand_rocks_02_ao_1k.jpg"
);
const floorMetalnessTexture = textureLoader.load(
    "./soil/coast_sand_rocks_02_arm_1k.jpg"
);
const floorColorMapTexture = textureLoader.load(
    "./soil/coast_sand_rocks_02_diff_1k.jpg"
);
const floorDispMapTexture = textureLoader.load(
    "./soil/coast_sand_rocks_02_dis_1k.jpg"
);
const floorNormalMapGLTexture = textureLoader.load(
    "./soil/coast_sand_rocks_02_nor_gl_1k.jpg"
); // Using GL version for normal map
const floorRoughnessMap = textureLoader.load(
    "./soil/coast_sand_rocks_02_rough_1k.jpg"
);

[
    floorAoMapTexture,
    floorMetalnessTexture,
    floorColorMapTexture,
    floorDispMapTexture,
    floorNormalMapGLTexture,
    floorRoughnessMap,
].forEach((texture) => {
    texture.repeat.set(4, 4);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
});

const planGeometry = new THREE.PlaneGeometry(20, 20, 100, 100);

const planMaterial = new THREE.MeshStandardMaterial({
    alphaMap: floorAlpha,
    transparent: true,
    map: floorColorMapTexture,
    aoMap: floorAoMapTexture,
    roughnessMap: floorRoughnessMap,
    normalMap: floorNormalMapGLTexture,
    displacementMap: floorDispMapTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
    metalnessMap: floorMetalnessTexture,
});

const plan = new THREE.Mesh(planGeometry, planMaterial);
plan.rotation.x = -Math.PI / 2;
scene.add(plan);

// HOUSE
const wallAoTexture = textureLoader.load("./walls/castle_brick_07_ao_1k.jpg");
const wallArmTexture = textureLoader.load("./walls/castle_brick_07_arm_1k.jpg");
const wallColorTexture = textureLoader.load(
    "./walls/castle_brick_07_diff_1k.jpg"
);
const wallNormalTexture = textureLoader.load(
    "./walls/castle_brick_07_nor_gl_1k.jpg"
);
const wallRoughTexture = textureLoader.load(
    "./walls/castle_brick_07_rough_1k.jpg"
);

const houseGeometry = new THREE.BoxGeometry(4, 2.5, 4);
const houseMaterial = new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAoTexture,
    roughnessMap: wallRoughTexture,
    normalMap: wallNormalTexture,
    metalnessMap: wallArmTexture,
});
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.set(0, 2.5 / 2, 0);
scene.add(house);

// DOOR
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("./door/alpha.jpg");
const doorColorTexture = textureLoader.load("./door/color.jpg");
const doorHeightTexture = textureLoader.load("./door/height.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

const doorGeometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);
const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture,
});
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, -2 / 8, 4 / 2);
house.add(door);

// Door Light
const doorLight = new THREE.PointLight("#ff7d46", 10, 0);
doorLight.position.set(0, 1.2, 2.5);
house.add(doorLight);

// const pointLightHelper = new THREE.PointLightHelper(doorLight, 0.2);
// scene.add(pointLightHelper);

// ROOF
const roofAoTexture = textureLoader.load("./roof/roof_slates_02_ao_1k.jpg");
const roofArmTexture = textureLoader.load("./roof/roof_slates_02_arm_1k.jpg");
const roofColorTexture = textureLoader.load(
    "./roof/roof_slates_02_diff_1k.jpg"
);
const roofNormalTexture = textureLoader.load(
    "./roof/roof_slates_02_nor_gl_1k.jpg"
);
const roofRougnessTexture = textureLoader.load(
    "./roof/roof_slates_02_rough_1k.jpg"
);

[
    roofAoTexture,
    roofArmTexture,
    roofColorTexture,
    roofNormalTexture,
    roofRougnessTexture,
].forEach((texture) => {
    texture.repeat.set(2, 1);
    texture.wrapS = THREE.RepeatWrapping;
});

const roofGeometry = new THREE.ConeGeometry(3.5, 1.5, 4);
const roofMaterial = new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofAoTexture,
    roughnessMap: roofRougnessTexture,
    normalMap: roofNormalTexture,
    metalnessMap: roofArmTexture,
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.rotation.y = -Math.PI / 4;
roof.position.y = (2.5 + 1.5) / 2;
house.add(roof);

// Brushes

const brushCOlorTexture = textureLoader.load(
    "./brush/leaves_forest_ground_diff_1k.jpg"
);
const brushAoTexture = textureLoader.load(
    "./brush/leaves_forest_ground_ao_1k.jpg"
);
const brushArmTexture = textureLoader.load(
    "./brush/leaves_forest_ground_arm_1k.jpg"
);
const brushDisplacementTexture = textureLoader.load(
    "./brush/leaves_forest_ground_disp_1k.jpg"
);
const brushNormalTexture = textureLoader.load(
    "./brush/leaves_forest_ground_nor_gl_1k.jpg"
);
const brushRoughTexture = textureLoader.load(
    "./brush/leaves_forest_ground_rough_1k.jpg"
);

const bushScales = [0.5, 0.25, 0.4, 0.15];
const bushPositions = [
    [0.8, 0.2, 2.2],
    [1.4, 0.1, 2.1],
    [-0.8, 0.1, 2.2],
    [-1, 0.05, 2.6],
];

const createBrushes = (geometry, scale = 1) => {
    const material = new THREE.MeshStandardMaterial({
        map: brushCOlorTexture,
        aoMap: brushAoTexture,
        roughnessMap: brushRoughTexture,
        metalnessMap: brushArmTexture,
        displacementMap: brushDisplacementTexture,
        displacementScale: 0.5,
        normalMap: brushNormalTexture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale, scale, scale);
    return mesh;
};

bushScales.forEach((scale, i) => {
    const bush = createBrushes(new THREE.SphereGeometry(1, 16, 16), scale);
    bush.position.set(...bushPositions[i]);
    scene.add(bush);
});

// Graves
const graves = new THREE.Group();
const plasteredStoneWallColorTexture = textureLoader.load(
    "./graves/plastered_stone_wall_diff_1k.jpg"
);
const plasteredStoneWallAoTexture = textureLoader.load(
    "./graves/plastered_stone_wall_ao_1k.jpg"
);
const plasteredStoneWallArmTexture = textureLoader.load(
    "./graves/plastered_stone_wall_arm_1k.jpg"
);
const plasteredStoneWallDisplacementTexture = textureLoader.load(
    "./graves/plastered_stone_wall_disp_1k.jpg"
);
const plasteredStoneWallNormalTexture = textureLoader.load(
    "./graves/plastered_stone_wall_nor_gl_1k.jpg"
);
const plasteredStoneWallRoughTexture = textureLoader.load(
    "./graves/plastered_stone_wall_rough_1k.jpg"
);
const createGraves = () => {
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.5 + Math.random() * 4;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
        const graveMaterial = new THREE.MeshStandardMaterial({
            map: plasteredStoneWallColorTexture,
            aoMap: plasteredStoneWallAoTexture,
            roughnessMap: plasteredStoneWallRoughTexture,
            metalnessMap: plasteredStoneWallArmTexture,
            normalMap: plasteredStoneWallNormalTexture,
        });
        const grave = new THREE.Mesh(graveGeometry, graveMaterial);
        grave.position.set(x, Math.random() * 0.2, z);
        grave.rotation.set(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
        );
        graves.add(grave);
    }
    scene.add(graves);
};

createGraves();

// Ghost
const ghost1 = new THREE.PointLight("#8800ff", 6);
const ghost2 = new THREE.PointLight("#ff0088", 6);
const ghost3 = new THREE.PointLight("#ff0000", 6);

const ghostRoaming = (elapsedTime) => {
    const ghostAngle = -elapsedTime * 0.5;
    ghost1.position.x = Math.sin(ghostAngle) * 4;
    ghost1.position.z = Math.cos(ghostAngle) * 4;
    ghost1.position.y =
        Math.sin(ghostAngle) *
        Math.sin(ghostAngle * 2.34) *
        Math.sin(ghostAngle * 2.34);

    const ghostAngle2 = elapsedTime * 0.38;
    ghost2.position.x = Math.sin(ghostAngle2) * 5;
    ghost2.position.z = Math.cos(ghostAngle2) * 5;
    ghost2.position.y =
        Math.sin(ghostAngle2) *
        Math.sin(ghostAngle2 * 2.34) *
        Math.sin(ghostAngle2 * 2.34);

    const ghostAngle3 = -elapsedTime * 0.23;
    ghost3.position.x = Math.sin(ghostAngle3) * 8;
    ghost3.position.z = Math.cos(ghostAngle3) * 8;
    ghost3.position.y =
        Math.sin(ghostAngle3) *
        Math.sin(ghostAngle3 * 2.34) *
        Math.sin(ghostAngle3 * 2.34);

    scene.add(ghost1, ghost2, ghost3);
};

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
house.castShadow = true;
house.receiveShadow = true;
roof.castShadow = true;
plan.castShadow = true;
plan.receiveShadow = true;

for (const grave of graves.children) {
    grave.castShadow = true;
    grave.receiveShadow = true;
}

// Sky
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

// Fog
scene.fog = new THREE.FogExp2("#02343f", 0.04)

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Timer control
const timer = new Timer();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = timer.getElapsed();

    timer.update();
    ghostRoaming(elapsedTime);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize event listener
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
