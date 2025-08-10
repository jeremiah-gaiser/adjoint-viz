import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Container
const container = document.getElementById('vis-container');

// Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xf0f0f0); // light gray background
container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Coordinate System
const axisLength = 1;
const headLength = 0.2;
const headWidth = 0.1;

const createArrow = (axis, color) => {
  const shaftRadius = 0.05;
  const shaftLength = axisLength - headLength;

  const shaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 32);
  const shaftMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5});
  const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

  const headGeometry = new THREE.ConeGeometry(headWidth, headLength, 32);
  const headMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
  const head = new THREE.Mesh(headGeometry, headMaterial);

  head.position.y = shaftLength / 2;
  shaft.add(head);

  const arrow = new THREE.Group();
  arrow.add(shaft);

  if (axis === 'x') {
    arrow.rotation.z = -Math.PI / 2;
  } else if (axis === 'z') {
    arrow.rotation.x = Math.PI / 2;
  }
  
  shaft.position.y = shaftLength / 2;

  return arrow;
};

const xAxis = createArrow('x', 0xFA8072); // salmon
const yAxis = createArrow('y', 0x90EE90); // lightgreen
const zAxis = createArrow('z', 0xADD8E6); // lightblue

scene.add(xAxis, yAxis, zAxis);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Handle Resize
window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
