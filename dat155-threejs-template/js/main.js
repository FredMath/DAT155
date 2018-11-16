import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    BoxBufferGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    MeshPhongMaterial,
    AmbientLight,
    Color,
    Fog,
    Vector3
} from './lib/Three.es.js';
import Tree from './terrain/Tree.js';


import Utilities from './lib/Utilities.js';
import MouseLookController from './controls/MouseLookController.js';

import TerrainBufferGeometry from './terrain/TerrainBufferGeometry.js';
import SkyDome from "./terrain/SkyDome.js";
import Balloon from "./terrain/Balloon.js";
import Water from "./terrain/Water.js";
import Stone from "./terrain/Stone.js";


let fogColor = new Color(0xffffff);
const scene = new Scene();


let move = {
    forward: false,
    backwards: false,
    left: false,
    right: false,
    speed: 0.02
};


scene.fog = new Fog(fogColor, -10, 100);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);


/**
 * Handle window resize:
 *  - update aspect ratio.
 *  - update projection matrix
 *  - update renderer size
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

/**
 * Add canvas element to DOM.
 */
document.body.appendChild(renderer.domElement);

const geometry = new BoxBufferGeometry(1, 1, 1);
const material = new MeshBasicMaterial({color: 0x00ff00});
const cube = new Mesh(geometry, material);

scene.add(cube);

camera.position.z = 55;
camera.position.y = 15;


/**
 * Add terrain:
 *
 * We have to wait for the image file to be loaded by the browser.
 * We pass a callback function with the stuff we want to do once the image is loaded.
 * There are many ways to handle asynchronous flow in your application.
 * An alternative way to handle asynchronous functions is async/await
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
 */
function light() {
    let light = new AmbientLight(0xffffff);
    light.intensity = 1;
    scene.add(light);
}

let loader = new TextureLoader();
Utilities.loadImage('resources/images/heightmap2.png').then((heightmapImage) => {

    const terrainGeometry = new TerrainBufferGeometry({
        heightmapImage,
        numberOfSubdivisions: 128
    });

    const terrainMaterial = new MeshPhongMaterial({
        map: loader.load("resources/images/terrain.jpg")
    });

    const terrain = new Mesh(terrainGeometry, terrainMaterial);

    scene.add(terrain);
    let tree = new Tree(terrainGeometry);
    scene.add(tree);
    let stone = new Stone(terrainGeometry);
    scene.add(stone);

});


/**
 * Set up camera controller:
 */

const mouseLookController = new MouseLookController(camera);

// We attach a click lister to the canvas-element so that we can request a pointer lock.
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
const canvas = renderer.domElement;

canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
});

let yaw = 0;
let pitch = 0;
const mouseSensitivity = 0.001;

function updateCamRotation(event) {
    yaw += event.movementX * mouseSensitivity;
    pitch += event.movementY * mouseSensitivity;
}

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
        canvas.addEventListener('mousemove', updateCamRotation, false);
    } else {
        canvas.removeEventListener('mousemove', updateCamRotation, false);
    }
});


/**
 * TODO: add movement with WASD.
 * Hint: You can use camera.getWorldDirection(target),
 * to get a vec3 representing the direction the camera is pointing.
 */

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            move.forward = true;
            e.preventDefault();
            break;

        case 'KeyA':
            move.left = true;
            e.preventDefault();
            break;

        case 'KeyS':
            move.backwards = true;
            e.preventDefault();
            break;

        case 'KeyD':
            move.right = true;
            e.preventDefault()
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW':
            move.forward = false;
            e.preventDefault();
            break;

        case 'KeyA':
            move.left = false;
            e.preventDefault();
            break;

        case 'KeyS':
            move.backwards = false;
            e.preventDefault();
            break;

        case 'KeyD':
            move.right = false;
            e.preventDefault();
            break;
    }
});


/**
 * Creates a skydome
 */

let skydome = new SkyDome();
scene.add(skydome);
let water = new Water();
scene.add(water);
light();

let balloon = new Balloon();
scene.add(balloon);

let velocity = new Vector3(0.0, 0.0, 0.0);
let then = performance.now();

function loop(now) {
    // update controller rotation.
    const delta = now - then;
    then = now;
    const moveSpeed = move.speed * delta;

    mouseLookController.update(pitch, yaw);
    yaw = 0;
    pitch = 0;

    velocity.set(0.0, 0.0, 0.0);

    if (move.left)
        velocity.x -= moveSpeed;
    if (move.right)
        velocity.x += moveSpeed;
    if (move.forward)
        velocity.z -= moveSpeed;
    if (move.backwards)
        velocity.z += moveSpeed;

    velocity.applyQuaternion(camera.quaternion);
    camera.position.add(velocity);


    // animate cube rotation:
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // render scene:
    renderer.render(scene, camera);

    requestAnimationFrame(loop);

}

loop();

