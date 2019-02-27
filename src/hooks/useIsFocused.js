import { useState, useCallback } from 'react';

// hooks to handle focus / blur count
// return a [boolean true if some child is focus, onFocus function, onBlur function, reset]
// onFocus and onBlur need to be applied on the parent element
export default () => {
  const [count, setCount] = useState(0);
  const onFocus = useCallback(() => setCount(c => c + 1), [setCount]);
  // the setTimeout is ugly, but is indispensable to assure that will be executed after the onFocus
  // there are some react issues on the onFocus / onBlur work around
  const onBlur = useCallback(() => setTimeout(() => setCount(c => c && c - 1), 0), [setCount]);
  return [count > 0, onFocus, onBlur];
};
