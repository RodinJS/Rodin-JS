'use strict';

System.register(['../../_build/js/three/THREE.GLOBAL.js', '../../_build/js/rodinjs/RODIN.js', '../../node_modules/three/examples/js/controls/VRControls.js', '../../node_modules/three/examples/js/effects/VREffect.js'], function (_export, _context) {
  "use strict";

  var THREE, RODIN;
  return {
    setters: [function (_buildJsThreeTHREEGLOBALJs) {
      THREE = _buildJsThreeTHREEGLOBALJs.THREE;
    }, function (_buildJsRodinjsRODINJs) {
      RODIN = _buildJsRodinjsRODINJs;
    }, function (_node_modulesThreeExamplesJsControlsVRControlsJs) {}, function (_node_modulesThreeExamplesJsEffectsVREffectJs) {}],
    execute: function () {

      console.log(RODIN);
    }
  };
});