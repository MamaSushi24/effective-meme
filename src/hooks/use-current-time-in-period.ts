'use client';
import dayjs from '@/libs/dayjs';
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export default function useCurrentTimeInPeriod(
  /** Format ['HH:mm', 'HH:mm'] */
  period?: [string, string] | null
) {
  const [isBetween, setIsBetween] = useState(true);
  useIsomorphicLayoutEffect(() => {
    const currentTime = dayjs();
    const isAvailable =
      !period ||
      currentTime.isBetween(
        dayjs(period[0], 'HH:mm'),
        dayjs(period[1], 'HH:mm'),
        'minutes'
      );
    setIsBetween(isAvailable);
  }, [period, setIsBetween]);
  return isBetween;
}
