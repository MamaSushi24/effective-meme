import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import CartHeader from '../cart-header/cart-header';

import styles from './cart-pending.module.scss';

interface CartPendingProps {
  onClose: () => void;
}
export default function CartPending({
  onClose,
}: CartPendingProps): JSX.Element {
  const { t: tRoot } = useTranslation('common');
  return (
    <div className={styles.panel}>
      <CartHeader onClose={onClose} className={styles.header} />
      <div className={styles.textTop}>ご注文ありがとうございました。</div>
      <div className={styles.title}>{tRoot('cart.pending.title')}</div>
      <div className={styles.subtitle}>{tRoot('cart.pending.text')}</div>
      <div className={styles.textBottom}>保留</div>
    </div>
  );
}
