import { THREE } from '../../three/THREE.GLOBAL.js';
import { Raycastables } from '../objects.js';
import { ErrorNoSceneProvided } from '../error/CustomErrors.js';


export class Raycaster extends THREE.Raycaster {
    constructor(_scene) {
        super();
        let scene = _scene;
        this.setScene = _scene => scene = _scene;
        this.getScene = () => scene;
    }

    raycast() {
        let scene = this.getScene();
        if (!scene) {
            throw new ErrorNoSceneProvided();
        }

        let ret = [];
        let intersects = this.intersectObjects(Raycastables, true);

        for (let i = 0; i < intersects.length; i++) {
            let centerObj = intersects[i].object;
            if (!centerObj) continue;

            while (centerObj && !centerObj.isSculpt && centerObj.parent !== scene) {
                if (centerObj.stopPropagation) {
                    break;
                }
                centerObj = centerObj.parent;
            }

            if (centerObj.stopPropagation) {
                if (centerObj.isSculpt) {
                    ret.push(centerObj.Sculpt);
                }
                continue;
            }

            if (!centerObj || !centerObj.isSculpt) continue;

            var parentObj = centerObj.Sculpt.object3D.parent;
            while (parentObj) {
                if (parentObj === scene) {
                    ret.push(centerObj.Sculpt);
                    break;
                }
                parentObj = parentObj.parent;
            }
        }
    }
}
