import clsx from 'clsx';
import React, { Children } from 'react';

import styles from './container.module.scss';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  renderAs?: React.ElementType;
}
export default function Container({
  children,
  className,
  renderAs = 'div',
}: ContainerProps): JSX.Element {
  const El = renderAs;
  return (
    <>
      <El className={clsx(styles.container, className)}>{children}</El>
    </>
  );
}
