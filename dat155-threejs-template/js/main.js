import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    BoxBufferGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    Fog,
} from './lib/Three.es.js';


import MouseLookController from './controls/MouseLookController.js';
import KeyboardController from './controls/KeyboardControls.js';

import SkyDome from "./terrain/SkyDome.js";
import Balloon from "./terrain/Balloon.js";
import Water from "./terrain/Water.js";
import Terrain from "./terrain/Terrain.js";
import Utilities from "./lib/Utilities.js";
import SunNode from "./terrain/SunNode.js";


let fogColor = new Color(0xffffff);
const scene = new Scene();


scene.fog = new Fog(fogColor, -10, 150);

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

// function light() {
//     let light = new AmbientLight(0xffffff);
//     light.intensity = 1.0;
//     scene.add(light);
// }

/**
 * Set up camera and keyboard controller:
 */

const mouseLookController = new MouseLookController(camera);
const keyboardController = new KeyboardController(camera);

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
 * Creates a skydome
 */

let skydome = new SkyDome();
scene.add(skydome);

let water = new Water();
scene.add(water);
// light();

let balloon = new Balloon();
scene.add(balloon);
scene.add(Utilities.drawPath(balloon.line));

let terrain = new Terrain();
scene.add(terrain);

let sun = new SunNode();
scene.add(sun);


let then = performance.now();

function loop(now) {
    // update controller rotation.
    const delta = now - then;
    then = now;

    mouseLookController.update(pitch, yaw);
    yaw = 0;
    pitch = 0;

    keyboardController.update(delta);
    sun.rotation.y += 0.004;

    // animate cube rotation:
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    balloon.fly();
    sun.updateLOD(camera);

    // render scene:
    renderer.render(scene, camera);

    requestAnimationFrame(loop);

}

loop();

