import clsx from 'clsx';
import { useState } from 'react';

import styles from './counter.module.scss';

interface CounterProps {
  className?: string;
  value: number;
  onChange: (value: number) => void;
  canSetZero?: boolean;
}
export default function Counter({
  value,
  onChange,
  canSetZero = false,
}: CounterProps): JSX.Element {
  const increment = () => {
    onChange(value + 1);
  };

  const decrement = () => {
    const canBeZero = canSetZero && value > 0;
    if (value > 1 || canBeZero) {
      onChange(value - 1);
    }
  };

  return (
    <div className={styles.counter}>
      <button className={styles.button} onClick={decrement}>
        -
      </button>
      <span className={styles.value}>{value}</span>
      <button className={styles.button} onClick={increment}>
        +
      </button>
    </div>
  );
}
