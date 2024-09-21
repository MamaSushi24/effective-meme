import clsx from 'clsx';

import styles from './spinner.module.scss';

interface SpinnerProps {
  className?: string;
}
export default function Spinner({ className }: SpinnerProps): JSX.Element {
  return (
    <div className={clsx(styles['lds-ring'], className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
