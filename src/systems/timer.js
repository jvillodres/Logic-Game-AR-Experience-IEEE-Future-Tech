/**
 * src/systems/timer.js
 *
 * Countdown timer with callback hooks.
 *
 * Usage:
 *   Timer.start(120, onTick, onExpire);
 *   Timer.stop();
 *   Timer.getRemaining();
 */

const Timer = (() => {
  let _interval   = null;
  let _remaining  = 0;
  let _onTick     = null;
  let _onExpire   = null;

  function start(seconds, onTick, onExpire) {
    stop(); // clear any existing timer
    _remaining = seconds;
    _onTick    = onTick;
    _onExpire  = onExpire;

    _tick(); // fire immediately so UI shows full time at start

    _interval = setInterval(() => {
      _remaining--;
      _tick();
      if (_remaining <= 0) {
        stop();
        if (_onExpire) _onExpire();
      }
    }, 1000);
  }

  function stop() {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  }

  function getRemaining() {
    return _remaining;
  }

  function _tick() {
    const m = Math.floor(_remaining / 60).toString().padStart(2, '0');
    const s = (_remaining % 60).toString().padStart(2, '0');
    if (_onTick) _onTick(`${m}:${s}`, _remaining);
  }

  return { start, stop, getRemaining };
})();

window.Timer = Timer;