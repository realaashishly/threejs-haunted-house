import { OrbitControls, Timer } from "three/examples/jsm/Addons.js";
import "./style.css";

import * as THREE from "three";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Controls

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Events

// Lights
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-1, 2, 4);

scene.add(directionalLight);

// Geometry

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x808080 });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const timer = new Timer();

// Animation
function animate() {
    requestAnimationFrame(animate);

    timer.update();
    const elapsedTime = timer.getElapsed();

    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    controls.update();

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
