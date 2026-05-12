/**
 * src/ui/inventory.js
 *
 * Manages the inventory bar displayed in the HUD.
 * Items are stored in GameState; this module only handles rendering.
 *
 * Depends on: game-state.js
 */

const Inventory = (() => {

  // Map item keys → display emoji
  const ICONS = {
    battery: '🔋',
    key:     '🗝️',
    crystal: '💎',
  };

  let _container; // the #inventory element

  function init() {
    _container = document.getElementById('inventory');

    // Re-render whenever the inventory changes
    GameState.on('inventoryChange', ({ value }) => render(value));

    // Render initial state
    render(GameState.get('inventory'));
  }

  /**
   * Render the current inventory array into slot elements.
   * Slots are generated dynamically — add more ICONS entries
   * to support more item types.
   */
  function render(items = []) {
    if (!_container) return;

    // Clear existing slots (keep the label)
    _container.querySelectorAll('.inv-slot').forEach(s => s.remove());

    // Render one slot per known item type
    Object.entries(ICONS).forEach(([key, icon]) => {
      const slot = document.createElement('div');
      slot.className = 'inv-slot' + (items.includes(key) ? ' filled' : '');
      slot.dataset.item = key;
      slot.title = key;

      const iconEl = document.createElement('span');
      iconEl.textContent = icon;
      iconEl.style.opacity = items.includes(key) ? '1' : '0.25';

      slot.appendChild(iconEl);
      _container.appendChild(slot);
    });
  }

  /** Add an item programmatically (also updates GameState) */
  function addItem(key) {
    const inv = GameState.get('inventory');
    if (!inv.includes(key)) {
      GameState.set('inventory', [...inv, key]);
    }
  }

  /** Remove an item programmatically */
  function removeItem(key) {
    const inv = GameState.get('inventory');
    GameState.set('inventory', inv.filter(k => k !== key));
  }

  return { init, addItem, removeItem };
})();

window.Inventory = Inventory;