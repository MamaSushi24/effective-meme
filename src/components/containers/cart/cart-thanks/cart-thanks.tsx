'use client';
import clsx from 'clsx';

import styles from './cart-thanks.module.scss';
import BgMobile from '../assets/cart-thanks-mobile.svg';
import BgDesktop from '../assets/cart-thanks-desktop.svg';
import CartHeader from '../cart-header/cart-header';
import { useTranslation } from 'next-i18next';
import useResponsive from '@/hooks/use-responsive';
import useCart from '@/hooks/use-cart';

interface CartThanksProps {
  onClose: () => void;
}
export default function CartThanks({ onClose }: CartThanksProps): JSX.Element {
  const { t: tRoot } = useTranslation('common');
  const { orderNumber, storedOrder } = useCart();
  const { isDesktop } = useResponsive();
  const orderNum = storedOrder?.orderNumber || orderNumber;
  return (
    <div className={styles.thanks}>
      <CartHeader onClose={onClose} className={styles.header} />
      {isDesktop ? (
        <BgDesktop className={styles.bg} />
      ) : (
        <BgMobile className={styles.bg} />
      )}
      <div className={styles.title}>{tRoot('cart.succes.title')}</div>
      <div className={styles.subtitle}>
        {tRoot('cart.succes.text', {
          orderNumber: orderNum,
        })}
      </div>
    </div>
  );
}
