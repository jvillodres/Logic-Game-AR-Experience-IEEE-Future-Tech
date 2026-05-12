/**
 * src/components/and-gate-logic.js
 *
 * A-Frame component: and-gate-logic
 *
 * Attach to the spaceship entity (or a parent wrapper).
 * Tracks the two required button presses and fires 'andGateSatisfied'
 * when both inputs are TRUE — implementing the AND logic gate.
 *
 * Usage:
 *   <a-entity and-gate-logic></a-entity>
 *
 * External triggers (called by HUD buttons):
 *   document.querySelector('[and-gate-logic]').components['and-gate-logic'].pressInput('battery');
 *   document.querySelector('[and-gate-logic]').components['and-gate-logic'].pressInput('launch');
 */

AFRAME.registerComponent('and-gate-logic', {
  schema: {},

  init() {
    this._inputA = false; // battery stabilised
    this._inputB = false; // launch engaged

    // React to scene-level events so the HUD buttons can trigger this
    this._onBatteryBtn = this._onBatteryBtn.bind(this);
    this._onLaunchBtn  = this._onLaunchBtn.bind(this);

    this.el.sceneEl.addEventListener('controlBatteryPressed', this._onBatteryBtn);
    this.el.sceneEl.addEventListener('controlLaunchPressed',  this._onLaunchBtn);
  },

  _onBatteryBtn() {
    if (GameState.get('currentStep') !== 3) return;
    this._inputA = true;
    GameState.set('btnBatteryPressed', true);
    this._evaluate();
  },

  _onLaunchBtn() {
    if (GameState.get('currentStep') !== 3) return;
    this._inputB = true;
    GameState.set('btnLaunchPressed', true);
    this._evaluate();
  },

  /**
   * AND truth table:
   *   A=0, B=0 → 0
   *   A=1, B=0 → 0
   *   A=0, B=1 → 0
   *   A=1, B=1 → 1  ← only this triggers launch
   */
  _evaluate() {
    this.el.sceneEl.emit('andGateUpdate', {
      inputA: this._inputA,
      inputB: this._inputB,
      output: this._inputA && this._inputB,
    });

    if (this._inputA && this._inputB) {
      this.el.sceneEl.emit('andGateSatisfied');
    }
  },

  /** Public method for direct calls */
  pressInput(input) {
    if (input === 'battery') this._onBatteryBtn();
    if (input === 'launch')  this._onLaunchBtn();
  },

  remove() {
    this.el.sceneEl.removeEventListener('controlBatteryPressed', this._onBatteryBtn);
    this.el.sceneEl.removeEventListener('controlLaunchPressed',  this._onLaunchBtn);
  },
});