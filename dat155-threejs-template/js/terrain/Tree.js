import {Mesh, MTLLoader, OBJLoader, Object3D} from "../lib/Three.es.js";
import Utilities from "../lib/Utilities.js";




export default class Tree extends Object3D{

    constructor(terrainGeometry) {
        super();
        new MTLLoader()
            .load('resources/models/lowPolyTree/lowpolytree.mtl', (materials) => {
                materials.preload();
                new OBJLoader()
                    .setMaterials(materials)
                    .load('resources/models/lowPolyTree/lowpolytree.obj', (object) => {

                        object.traverse((node) => {
                            if (node instanceof Mesh) {
                                node.material[0].emissive.setHex(0x006900);
                                node.material[0].emissiveIntensity = 0.4;
                                node.material[1].emissive.setHex(0x404040);
                                node.material[1].emissiveIntensity = 0.4;
                                node.material[0].roughness = 1.0;
                                node.material[1].roughness = 1.0;
                            }

                        });

                        const trees = Utilities.cloneObjects(object, 40);
                        for (let i = 0; i < trees.length; i++) {
                            trees[i].position.xyz = Utilities.randomXAndZCord(trees[i].position, terrainGeometry);
                            trees[i].position.x -=50;
                            trees[i].position.z -=50;
                            trees[i].position.y += 0.7;
                            trees[i].scale.set(0.3, 0.3, 0.3);
                            this.add( trees[i] );
                        }

                        this.add(object);

                    });

            });
    }
}

