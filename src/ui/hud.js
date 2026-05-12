/**
 * src/ui/hud.js
 *
 * Manages the HUD overlay (top bar, timer display, toast, step messages,
 * win screen).  All DOM operations for UI elements that aren't inventory
 * or the logic diagram are centralised here.
 *
 * Depends on: game-state.js, timer.js
 */

const HUD = (() => {

  // ── Step label copy ──────────────────────────────────────
  const STEP_LABELS = {
    1: 'Buscar la batería',
    2: 'Conectar batería a la nave',
    3: 'Activar ambos controles (AND) para despegar',
  };

  // ── Internal refs (populated on init) ───────────────────
  let _els = {};

  function init() {
    _els = {
      stepLabel:    document.getElementById('current-step'),
      timerDisplay: document.getElementById('timer'),
      toast:        document.getElementById('toast'),
      stepMsg:      document.getElementById('step-msg'),
      msgIcon:      document.getElementById('msg-icon'),
      msgText:      document.getElementById('msg-text'),
      msgSub:       document.getElementById('msg-sub'),
      winScreen:    document.getElementById('win-screen'),
      controlPanel: document.getElementById('control-panel'),
    };

    // Subscribe to GameState changes
    GameState.on('currentStepChange', ({ value }) => setStep(value));

    // Start timer (120 s default)
    Timer.start(
      120,
      (label, remaining) => _onTick(label, remaining),
      () => _onExpire()
    );
  }

  // ── Timer callbacks ──────────────────────────────────────
  function _onTick(label, remaining) {
    if (!_els.timerDisplay) return;
    _els.timerDisplay.textContent = label;
    _els.timerDisplay.className   = remaining <= 20 ? 'hud-panel urgent' : 'hud-panel';
  }

  function _onExpire() {
    showMessage('⏰', '¡Se acabó el tiempo!', 'Inténtalo de nuevo');
    setTimeout(() => location.reload(), 3000);
  }

  // ── Step display ─────────────────────────────────────────
  function setStep(n) {
    if (_els.stepLabel) {
      _els.stepLabel.textContent = STEP_LABELS[n] || '';
    }
  }

  // ── Toast ────────────────────────────────────────────────
  let _toastTimeout;

  function showToast(msg, duration = 2800) {
    if (!_els.toast) return;
    _els.toast.textContent = msg;
    _els.toast.classList.add('show');
    clearTimeout(_toastTimeout);
    _toastTimeout = setTimeout(() => _els.toast.classList.remove('show'), duration);
  }

  // ── Centered message ─────────────────────────────────────
  function showMessage(icon, text, sub, autoDismiss = 0) {
    if (!_els.stepMsg) return;
    _els.msgIcon.textContent = icon;
    _els.msgText.textContent = text;
    _els.msgSub.textContent  = sub;
    _els.stepMsg.classList.add('show');
    if (autoDismiss > 0) setTimeout(hideMessage, autoDismiss);
  }

  function hideMessage() {
    _els.stepMsg?.classList.remove('show');
  }

  // ── Control panel ────────────────────────────────────────
  function showControlPanel() {
    _els.controlPanel?.classList.remove('hidden');
  }

  function hideControlPanel() {
    _els.controlPanel?.classList.add('hidden');
  }

  // ── Win screen ───────────────────────────────────────────
  function showWinScreen() {
    _els.winScreen?.classList.add('show');
  }

  return {
    init,
    setStep,
    showToast,
    showMessage,
    hideMessage,
    showControlPanel,
    hideControlPanel,
    showWinScreen,
  };
})();

window.HUD = HUD;