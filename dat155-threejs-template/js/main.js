import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    BoxBufferGeometry,
    MeshBasicMaterial,
    Mesh
} from './lib/three.module.js';


import Utilities from './lib/Utilities.js';
import MouseLookController from './controls/MouseLookController.js';

import TerrainBufferGeometry from './terrain/TerrainBufferGeometry.js';
import {SphereBufferGeometry, TextureLoader} from "./lib/three.module.js";
import {MeshPhongMaterial, PlaneBufferGeometry} from "./lib/three.module.js";
import {AmbientLight} from "./lib/three.module.js";
import {Color} from "./lib/three.module.js";
import {Fog} from "./lib/three.module.js";
import OBJLoader from "./lib/OBJLoader.js";



let fogColor = new Color(0xffffff);
const scene = new Scene();
//
let objectLoader = new OBJLoader();

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


objectLoader.load('resources/models/lowPolyTree/lowpolytree.obj',
    function (object) {
    console.log(object);
    object.children[0].material[0].color.set(0x006400);
    object.children[0].material[1].color.set(0x8B4513);

        scene.add(object);

    });



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
Utilities.loadImage('resources/images/heightmap.png').then((heightmapImage) => {

    const terrainGeometry = new TerrainBufferGeometry({
        heightmapImage,
        numberOfSubdivisions: 128
    });

    const terrainMaterial = new MeshPhongMaterial({
        map: loader.load("resources/images/terrain.jpg")
    });

    const terrain = new Mesh(terrainGeometry, terrainMaterial);

    scene.add(terrain);

});
function water() {
    let waterGeometry = new PlaneBufferGeometry(200, 200);
    let waterTexture = loader.load("resources/images/water.jpg");

    let waterMaterial = new MeshPhongMaterial({
        map: waterTexture,
        side: 2
    });

    let water = new Mesh(waterGeometry, waterMaterial);
    water.translateY(7);
    water.rotation.x = Math.PI * -0.5;
    scene.add(water);

}

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

let moveSpeed = 2;
let direction = camera.getWorldDirection();
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    camera.getWorldDirection(direction);

    switch (e.code) {
        case 'KeyW':
            camera.position.add(direction.multiplyScalar(moveSpeed));
            break;

        case 'KeyA':


            break;

        case 'KeyS':
            camera.position.add(direction.multiplyScalar(-moveSpeed));
            break;

        case 'KeyD':
            break;
    }
    camera.updateWorldMatrix();
});





/**
 * Creates a skydome
 */
function skydome() {
    let skyGeometry = new SphereBufferGeometry(100, 32, 16);
    let skyTexture = loader.load("resources/skydome/skyTexture.png");


    let skyMaterial = new MeshPhongMaterial({
        map: skyTexture,
        opacity: 5.0,
        side: 2
    });

    let sky = new Mesh(skyGeometry, skyMaterial);


    scene.add(sky);
}
skydome();
water();
light();

function loop() {
    // update controller rotation.
    mouseLookController.update(pitch, yaw);
    yaw = 0;
    pitch = 0;

    // animate cube rotation:
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // render scene:
    renderer.render(scene, camera);

    requestAnimationFrame(loop);

}

loop();

