import {MTLLoader, OBJLoader} from "../lib/Three.es.js";



class Tree {

    tree(scene) {
        this._scene = scene;
        let objLoader = new OBJLoader();
        let mtlLoader = new MTLLoader();
        mtlLoader.load('resources/models/lowPolyTree/lowpolytree.mtl', function (materials) {

            this.materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load('resources/models/lowPolyTree/lowpolytree.obj', function (object) {
                object.position.y = 10;

                this.scene.add(object);

            });

        });
    }
}

export {Tree}