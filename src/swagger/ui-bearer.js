;(function() {
  if (typeof window === 'undefined') return;
  if (!window.ui || typeof window.ui.getSystem !== 'function') return;
  try {
    var sys = window.ui.getSystem();
    if (!sys || !sys.authActions || typeof sys.authActions.authorize !== 'function') return;
    var originalAuthorize = sys.authActions.authorize;

    sys.authActions.authorize = function(payload) {
      try {
        if (payload && typeof payload === 'object') {
          Object.keys(payload).forEach(function(key) {
            var cfg = payload[key];
            if (cfg && typeof cfg === 'object' && typeof cfg.value === 'string') {
              var v = cfg.value.trim();
              if (v && v.toLowerCase().indexOf('bearer ') !== 0) {
                cfg.value = 'Bearer ' + v;
              }
            }
          });
        }
      } catch (e) {
        if (console && console.warn) console.warn('ui-bearer authorize wrapper error:', e);
      }
      return originalAuthorize.apply(this, arguments);
    };
  } catch (e) {
    if (console && console.warn) console.warn('ui-bearer init error:', e);
  }
})();

