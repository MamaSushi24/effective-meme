import gsap from 'gsap';
import { useMemo } from 'react';

function useGsapContext(scope: string | object | Element) {
  const ctx = useMemo(() => gsap.context(() => {}, scope), [scope]);
  return ctx;
}
export default useGsapContext;
