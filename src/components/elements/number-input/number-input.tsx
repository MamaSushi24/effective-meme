import clsx from 'clsx';
import { useState } from 'react';

import styles from './number-input.module.scss';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export default function NumberInput({
  value,
  onChange,
  className,
  inputProps,
}: NumberInputProps): JSX.Element {
  const handleIncrement = () => {
    if (value < 1) {
      onChange(1);
    } else {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className={styles.field}>
      <button
        className={clsx(styles.button, styles.decrement)}
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        className={clsx(styles.input, className)}
        type="number"
        value={value}
        readOnly
        {...inputProps}
      />
      <button
        className={clsx(styles.button, styles.increment)}
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
}
