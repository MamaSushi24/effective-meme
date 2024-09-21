import { useCallback, useEffect } from 'react';
import viewportSize from 'viewport-size';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';
export default function useSetVPVars(): void {
  const setterFn = useCallback(() => {
    const viewportWidth = viewportSize.getWidth();
    const viewportHeight = viewportSize.getHeight();
    const vw = viewportWidth / 100;
    const vh = viewportHeight / 100;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty(
      '--vmin',
      `${Math.min(vw, vh)}px`,
    );
    document.documentElement.style.setProperty(
      '--vmax',
      `${Math.max(vw, vh)}px`,
    );
    document.documentElement.style.setProperty(
      '--vp-width',
      `${viewportWidth}px`,
    );
    document.documentElement.style.setProperty(
      '--vp-height',
      `${viewportHeight}px`,
    );
  }, []);

  useIsomorphicLayoutEffect(() => {
    setterFn();
    let windowInnerWidth = window.innerWidth;
    let windowInnerHeight = window.innerHeight;
    const resizeHandler = () => {
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      if (vpWidth !== windowInnerWidth || vpHeight !== windowInnerHeight) {
        setterFn();
        windowInnerWidth = vpWidth;
        windowInnerHeight = vpHeight;
      }
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [setterFn]);
}
