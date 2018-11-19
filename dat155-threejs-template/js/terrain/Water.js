import {Mesh, MeshPhongMaterial, PlaneBufferGeometry, Object3D, TextureLoader} from "../lib/Three.es.js";



export default class Water extends Object3D {
    constructor (){
        super();
        let loader = new TextureLoader();
        let waterGeometry = new PlaneBufferGeometry(200, 200);
        let waterTexture = loader.load("resources/images/water.jpg");

        let waterMaterial = new MeshPhongMaterial({
            map: waterTexture,
            side: 2,
            receiveShadow: true
        });

        let water = new Mesh(waterGeometry, waterMaterial);
        water.translateY(0.25);
        water.rotation.x = Math.PI * -0.5;
        this.add(water);

    }

}