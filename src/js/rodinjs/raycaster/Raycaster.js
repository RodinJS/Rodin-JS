import { THREE } from '../../vendor/three/THREE.GLOBAL.js';
import { Raycastables } from '../objects.js';
import { ErrorNoSceneProvided } from '../error/CustomErrors.js';

/**
 * Class Raycaster
 */
export class Raycaster extends THREE.Raycaster {
    constructor(_scene) {
        super();
        let scene = _scene;
        this.setScene = _scene => scene = _scene;
        this.getScene = () => scene;
    }

    /**
     * Raycast
     * @returns [Sculpt] all raycast objects that added to scene.
     */
    raycast() {
        let scene = this.getScene();
        if (!scene) {
            throw new ErrorNoSceneProvided();
        }

        let ret = [];
        let intersects = this.intersectObjects(Raycastables);

        for (let i = 0; i < intersects.length; i++) {
            let centerObj = intersects[i].object;
            if (!centerObj) continue;

            while (centerObj && !centerObj.Sculpt && centerObj.parent !== scene) {
                if (centerObj.stopPropagation) {
                    break;
                }
                centerObj = centerObj.parent;
            }

            if (centerObj.stopPropagation) {
                if (centerObj.Sculpt) {
                    ret.push(intersects[i]);
                }
                continue;
            }

            if (!centerObj || !centerObj.Sculpt) continue;

            let parentObj = centerObj.Sculpt.object3D.parent;
            while (parentObj) {
                if (parentObj === scene) {
                    ret.push(intersects[i]);
                    break;
                }
                parentObj = parentObj.parent;
            }
        }

        return ret;
    }
}
