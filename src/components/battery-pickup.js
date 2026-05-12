/**
 * src/components/battery-pickup.js
 *
 * A-Frame component: battery-pickup
 *
 * Attach to the battery entity. When the user clicks/taps it,
 * emits a 'batteryCollected' event on the scene and updates GameState.
 *
 * Usage in HTML:
 *   <a-entity battery-pickup gltf-model="#battery-model" ...></a-entity>
 *
 * Listen to the result:
 *   document.querySelector('a-scene').addEventListener('batteryCollected', handler);
 */

AFRAME.registerComponent('battery-pickup', {
  schema: {
    collected: { type: 'boolean', default: false },
  },

  init() {
    this._onClick = this._onClick.bind(this);
    this.el.addEventListener('click', this._onClick);

    // Visual: gentle floating animation
    this.el.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 2000,
      easing: 'easeInOutSine',
      loop: true,
      to: { x: this.el.object3D.position.x,
            y: this.el.object3D.position.y + 0.05,
            z: this.el.object3D.position.z },
    });
  },

  _onClick() {
    if (this.data.collected) return;
    if (GameState.get('currentStep') !== 1) return;

    this.data.collected = true;

    // Update global state
    GameState.set('batteryCollected', true);
    const inv = GameState.get('inventory');
    GameState.set('inventory', [...inv, 'battery']);
    GameState.set('currentStep', 2);

    // Hide the entity
    this.el.setAttribute('visible', false);

    // Notify the rest of the game
    this.el.sceneEl.emit('batteryCollected', { entity: this.el });
  },

  remove() {
    this.el.removeEventListener('click', this._onClick);
  },
});