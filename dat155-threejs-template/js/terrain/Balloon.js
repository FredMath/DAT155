import {Object3D, OBJLoader, MTLLoader} from "../lib/Three.es.js";



export default class Balloon extends Object3D {

    constructor() {
        super();
        new MTLLoader()
            .load('resources/models/Balloon/Air_Balloon.mtl', (materials) => {
                materials.preload();
                new OBJLoader()
                    .setMaterials(materials)
                    .load('resources/models/Balloon/Air_Balloon.obj', (object) => {


                        object.position.y = 25;
                        object.position.x = 5;

                        object.scale.set(0.15, 0.15, 0.15);

                        this.add(object);

                    });

            });
    }
}