/**
 * navigate re-routes the user to the specified path
 */
function navigate(path: string) {
  window.location.href = path;
}

declare var halfmoon: {
  initStickyAlert: (options: {
    content: string;
    alertType: string;
    fillType: string;
  }) => void;
};

/**
 * toast flashes a message on the screen
 */
function toast(msg: string, type: string = Misc.Danger) {
  halfmoon.initStickyAlert({
    content: msg,
    alertType: 'alert-' + type,
    fillType: 'filled-lm',
  });
}

/**
 * store stores the specified key value pair in local storage in an
 * overwrite manner
 */
function store(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * retrieve retrieves the specified key from local storage
 * and returns the value
 */
function retrieve(key: string): unknown {
  return JSON.parse(window.localStorage.getItem(key) || '{}');
}

/**
 * stage retrieves the local context and sets it
 */
function stage() {
  const context = retrieve('context') as Context;
  if (context) {
    Context = context;
  }
}
