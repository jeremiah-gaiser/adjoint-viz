import * as THREE from 'three';

// --- Helper function to create a 2D scene ---
function createScene(containerId) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();

    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 5;
    const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf0f0f0);
    container.appendChild(renderer.domElement);
    
    // Handle Resize
    window.addEventListener('resize', () => {
        const aspect = container.clientWidth / container.clientHeight;
        camera.left = frustumSize * aspect / - 2;
        camera.right = frustumSize * aspect / 2;
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / - 2;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    return { scene, camera, renderer, container };
}

// --- Arrow and Point creation for 2D ---
const createVectorRepresentation = (vector, color) => {
    const group = new THREE.Group();
    
    // Arrow
    const lineMaterial = new THREE.LineBasicMaterial({ color });
    const points = [new THREE.Vector3(0, 0, 0), vector];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);

    // Point
    const pointGeometry = new THREE.BufferGeometry().setFromPoints([vector]);
    const pointMaterial = new THREE.PointsMaterial({ color, size: 0.4 });
    const point = new THREE.Points(pointGeometry, pointMaterial);
    group.add(point);

    return group;
};


// --- Get input values ---
const getInputs = () => {
    const vecX = parseFloat(document.getElementById('vec-x').value);
    const vecY = parseFloat(document.getElementById('vec-y').value);
    const matA = parseFloat(document.getElementById('mat-a').value);
    const matB = parseFloat(document.getElementById('mat-b').value);
    const matC = parseFloat(document.getElementById('mat-c').value);
    const matD = parseFloat(document.getElementById('mat-d').value);

    return {
        inputVector: new THREE.Vector3(vecX, vecY, 0),
        transformationMatrix: new THREE.Matrix3().set(matA, matC, 0, matB, matD, 0, 0, 0, 1)
    };
};


// --- Setup scenes ---
const inputVis = createScene('input-scene');
const outputVis = createScene('output-scene');

let { inputVector, transformationMatrix } = getInputs();

// --- Create and add initial vectors ---
const iHat = new THREE.Vector3(1, 0, 0);
const jHat = new THREE.Vector3(0, 1, 0);

let iHatRepIn = createVectorRepresentation(iHat.clone(), 0xff0000);
let jHatRepIn = createVectorRepresentation(jHat.clone(), 0x00ff00);
let vecRepIn = createVectorRepresentation(inputVector.clone(), 0x0000ff);

inputVis.scene.add(iHatRepIn, jHatRepIn, vecRepIn);

let iHatRepOut = createVectorRepresentation(iHat.clone().applyMatrix3(transformationMatrix), 0xff0000);
let jHatRepOut = createVectorRepresentation(jHat.clone().applyMatrix3(transformationMatrix), 0x00ff00);
let vecRepOut = createVectorRepresentation(inputVector.clone().applyMatrix3(transformationMatrix), 0x0000ff);

outputVis.scene.add(iHatRepOut, jHatRepOut, vecRepOut);


// --- Update logic ---
function updateVisualizations() {
    ({ inputVector, transformationMatrix } = getInputs());

    // Update input scene
    inputVis.scene.remove(vecRepIn);
    vecRepIn = createVectorRepresentation(inputVector.clone(), 0x0000ff);
    inputVis.scene.add(vecRepIn);

    // Update output scene
    const iHatTransformed = iHat.clone().applyMatrix3(transformationMatrix);
    const jHatTransformed = jHat.clone().applyMatrix3(transformationMatrix);
    const vecTransformed = inputVector.clone().applyMatrix3(transformationMatrix);

    outputVis.scene.remove(iHatRepOut, jHatRepOut, vecRepOut);
    
    iHatRepOut = createVectorRepresentation(iHatTransformed, 0xff0000);
    jHatRepOut = createVectorRepresentation(jHatTransformed, 0x00ff00);
    vecRepOut = createVectorRepresentation(vecTransformed, 0x0000ff);

    outputVis.scene.add(iHatRepOut, jHatRepOut, vecRepOut);
}

// --- Event Listeners for controls ---
document.getElementById('vec-x').addEventListener('input', updateVisualizations);
document.getElementById('vec-y').addEventListener('input', updateVisualizations);
document.getElementById('mat-a').addEventListener('input', updateVisualizations);
document.getElementById('mat-b').addEventListener('input', updateVisualizations);
document.getElementById('mat-c').addEventListener('input', updateVisualizations);
document.getElementById('mat-d').addEventListener('input', updateVisualizations);


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    
    inputVis.renderer.render(inputVis.scene, inputVis.camera);
    outputVis.renderer.render(outputVis.scene, outputVis.camera);
}

animate();
