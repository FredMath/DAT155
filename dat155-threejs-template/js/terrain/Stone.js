import {Mesh, MTLLoader, OBJLoader, Object3D} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";




export default class Stone extends Object3D{

    constructor(terrainGeometry) {
        super();
        new MTLLoader()
            .load('resources/models/rocks/stone.mtl', (materials) => {
                materials.preload();
                new OBJLoader()
                    .setMaterials(materials)
                    .load('resources/models/rocks/stone.obj', (object) => {

                        object.traverse((node) => {
                            if (node instanceof Mesh) {
                                node.material.emissive.setHex(0x808080);
                                node.material.emissiveIntensity = 0.4;

                            }

                        });

                        const stones = Utilities.cloneObjects(object, 20);
                        for (let i = 0; i < stones.length; i++) {
                            stones[i].position.xyz = Utilities.randomXAndZCord(stones[i].position, terrainGeometry);
                            stones[i].position.x -=50;
                            stones[i].position.z -=50;
                            stones[i].position.y += 0.3;
                            stones[i].scale.set(0.2, 0.2, 0.2);
                            this.add( stones[i] );
                        }

                        this.add(object);

                    });

            });
    }
}