import clsx from 'clsx';

import styles from './button.module.scss';

interface ButtonProps {
  className?: string;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  size?: 'extra-small' | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
}

export default function Button({
  className,
  label,
  href,
  size = 'medium',
  color = 'primary',
  type,
  disabled,
  target,
  onClick,
}: ButtonProps): JSX.Element {
  const buttonClassName = clsx(
    styles.button,
    styles[size],
    styles[color],
    styles[disabled ? 'disabled' : ''],
    className
  );

  if (href) {
    return (
      <a href={href} target={target} className={buttonClassName}>
        {label}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
    >
      {label}
    </button>
  );
}
