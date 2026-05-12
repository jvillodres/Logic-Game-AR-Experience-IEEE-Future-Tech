/**
 * src/ui/logic-helper.js
 *
 * Animates the logic gate diagram shown in the bottom-left HUD panel.
 * Listens to scene events emitted by A-Frame components and lights up
 * the diagram accordingly.
 *
 * Depends on: game-state.js
 * Listens to scene events: andGateUpdate, andGateSatisfied
 */

const LogicHelper = (() => {

  let _els = {};

  function init() {
    _els = {
      chipA:   document.getElementById('chip-battery'),
      chipB:   document.getElementById('chip-launch'),
      connTop: document.getElementById('conn-top'),
      connBot: document.getElementById('conn-bot'),
      output:  document.getElementById('gate-out'),
    };

    // Listen to A-Frame scene events
    // (scene may not exist yet if called before a-scene is ready)
    const scene = document.querySelector('a-scene');
    if (scene) {
      _bindSceneEvents(scene);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        const s = document.querySelector('a-scene');
        if (s) _bindSceneEvents(s);
      });
    }
  }

  function _bindSceneEvents(scene) {
    scene.addEventListener('andGateUpdate', ({ detail }) => {
      _setInput('A', detail.inputA);
      _setInput('B', detail.inputB);
      _setOutput(detail.output);
    });
  }

  function _setInput(input, active) {
    if (input === 'A') {
      _els.chipA?.classList.toggle('active', active);
      _els.connTop?.classList.toggle('lit', active);
    } else {
      _els.chipB?.classList.toggle('active', active);
      _els.connBot?.classList.toggle('lit', active);
    }
  }

  function _setOutput(active) {
    _els.output?.classList.toggle('active', active);
  }

  /**
   * Call this to manually update the diagram from outside A-Frame
   * (e.g. during the HTML-only prototype phase).
   */
  function update(inputA, inputB) {
    _setInput('A', inputA);
    _setInput('B', inputB);
    _setOutput(inputA && inputB);
  }

  return { init, update };
})();

window.LogicHelper = LogicHelper;