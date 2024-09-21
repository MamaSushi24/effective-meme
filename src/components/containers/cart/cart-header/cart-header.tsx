import clsx from 'clsx';

import styles from './cart-header.module.scss';
import CloseIcon from '../assets/close-icon.svg';
import BackIcon from '../assets/back-icon.svg';

interface CartHeaderProps {
  className?: string;
  title?: string;
  onClose: () => void;
  onBackClick?: () => void;
}
export default function CartHeader({
  className,
  title,
  onClose,
  onBackClick,
}: CartHeaderProps): JSX.Element {
  return (
    <div className={clsx(styles.header, className)}>
      {onBackClick && (
        <button className={styles.backButton} onClick={onBackClick}>
          <BackIcon />
        </button>
      )}
      <div className={styles.title}>{title}</div>
      <button className={styles.closeButton} onClick={onClose}>
        <CloseIcon />
      </button>
    </div>
  );
}
