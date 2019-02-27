import { useEffect } from 'react';

// debounce an useEffect call of timeout time
// when useEffect dispose, clear the timeout and dispose the fn return
export default (fn, timeout, store) => useEffect(() => {
  let dispose = null;
  const timeoutId = setTimeout(() => {
    dispose = fn();
  }, timeout);
  return () => {
    clearTimeout(timeoutId);
    if (dispose && typeof dispose === 'function') dispose();
  };
}, store);
