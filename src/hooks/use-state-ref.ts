import { useCallback, useRef, useState } from 'react';

function useStateRef<T = any>(defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const ref = useRef<T>(state);

  const dispatch = useCallback(value => {
    ref.current = typeof value === 'function' ? value(ref.current) : value;
    setState(ref.current);
  }, []);

  return [state, dispatch, ref];
}
export default useStateRef;
