import { useMediaQuery } from 'react-responsive';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/consts/breakpoints';

interface IUseMediaQuery {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export default function useResponsive(): IUseMediaQuery {
  const isMobileResp = useMediaQuery({
    maxWidth: BREAKPOINTS.MD - 1,
  });
  const isTabletResp = useMediaQuery({
    minWidth: BREAKPOINTS.MD,
    maxWidth: BREAKPOINTS.XL - 1,
  });
  const isDesktopResp = useMediaQuery({ minWidth: BREAKPOINTS.XL });

  const [isMobile, setIsMobile] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileResp);
    setIsTablet(isTabletResp);
    setIsDesktop(isDesktopResp);
  }, [isMobileResp, isTabletResp, isDesktopResp]);

  return { isMobile, isTablet, isDesktop };
}
