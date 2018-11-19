import {LOD, TextureLoader, MeshBasicMaterial, PointLight, IcosahedronBufferGeometry, Mesh} from "../lib/Three.es.js";


export default class Sun extends LOD {

    constructor() {
        super();

        const texture = new TextureLoader().load('./resources/images/sunTexture.jpg');

        const material = new MeshBasicMaterial({
            map: texture,
            fog: false,
            wireframe: true
        });




        for( let i = 0; i < 3; i++ ) {

            let geometry = new IcosahedronBufferGeometry( 5, 3 - i );
            this.addLevel( new Mesh(geometry, material), (i * 30));

        }


        this.position.y = 90;
        this.position.x = 42;
        let light = new PointLight(0xFFFFFF, 1.0, 500.0);
        light.castShadow = true;

        this.add(light);


    }

}
