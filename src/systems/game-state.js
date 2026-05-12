/**
 * src/systems/game-state.js
 *
 * Single source of truth for the entire game session.
 * Persisted to localStorage so progress survives page reloads.
 *
 * Usage from anywhere:
 *   GameState.get('inventory')
 *   GameState.set('inventory', [...])
 *   GameState.on('stepChange', handler)
 *   GameState.emit('stepChange', { step: 2 })
 */

const GameState = (() => {
  // ── Default state ──────────────────────────────────────────────
  const DEFAULTS = {
    currentWorld: 1,
    currentLevel: 1,
    currentStep: 1,

    inventory: [],          // e.g. ['battery']
    unlockedPets: [],       // e.g. ['astro-dog']
    completedLevels: [],    // e.g. [1, 2]

    // Per-level transient flags (reset on level load)
    batteryCollected: false,
    batteryConnected: false,
    btnBatteryPressed: false,
    btnLaunchPressed: false,
  };

  // ── Internal store ─────────────────────────────────────────────
  let _store = { ...DEFAULTS };
  const _listeners = {};

  // ── Persistence ────────────────────────────────────────────────
  function _load() {
    try {
      const saved = localStorage.getItem('spaceMission_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore persistent fields, not transient flags
        const persistent = ['currentWorld','currentLevel','inventory',
                            'unlockedPets','completedLevels'];
        persistent.forEach(k => {
          if (parsed[k] !== undefined) _store[k] = parsed[k];
        });
      }
    } catch (e) {
      console.warn('[GameState] Could not load from localStorage:', e);
    }
  }

  function _save() {
    try {
      localStorage.setItem('spaceMission_state', JSON.stringify(_store));
    } catch (e) {
      console.warn('[GameState] Could not save to localStorage:', e);
    }
  }

  // ── Public API ─────────────────────────────────────────────────
  function get(key) {
    return _store[key];
  }

  function set(key, value) {
    _store[key] = value;
    _save();
    emit(key + 'Change', { key, value });
  }

  /** Reset only transient (per-level) flags */
  function resetLevel() {
    _store.currentStep      = 1;
    _store.batteryCollected = false;
    _store.batteryConnected = false;
    _store.btnBatteryPressed = false;
    _store.btnLaunchPressed  = false;
  }

  // ── Event bus ──────────────────────────────────────────────────
  function on(event, handler) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(handler);
  }

  function off(event, handler) {
    if (!_listeners[event]) return;
    _listeners[event] = _listeners[event].filter(h => h !== handler);
  }

  function emit(event, data) {
    (_listeners[event] || []).forEach(h => h(data));
  }

  // Bootstrap
  _load();

  return { get, set, resetLevel, on, off, emit };
})();

// Make globally available (no module bundler assumed)
window.GameState = GameState;