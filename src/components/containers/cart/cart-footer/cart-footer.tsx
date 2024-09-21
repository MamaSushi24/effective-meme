import clsx from 'clsx';

import styles from './cart-footer.module.scss';
import { useTranslation } from 'next-i18next';
import useCart from '@/hooks/use-cart';
import { useMemo } from 'react';
import { LineItemType } from '@/modules/cart/CartLine/ILineItem';

interface CartFooterProps {
  className?: string;
  minPrice?: boolean;
}
export default function CartFooter({
  className,
  minPrice,
}: CartFooterProps): JSX.Element {
  const { t } = useTranslation('common', {
    keyPrefix: 'cart.footer',
  });
  const { t: tRoot } = useTranslation('common');
  const {
    totalPrice,
    minOrderPrice,
    freeDeliveryPrice,
    // deliveryPrice,
    discountMoney,
    items,
    cartState,
  } = useCart();
  const deliveryPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      if (item.type === LineItemType.SHIPPING_LINE)
        return acc + item.finalLinePrice;
      return acc;
    }, 0);
  }, [items]);
  const totalPriceWithDiscount = totalPrice - discountMoney;
  const totalPriceWithoutDelivery = totalPriceWithDiscount - deliveryPrice;

  const isFreeDelivery = totalPriceWithoutDelivery >= freeDeliveryPrice;
  const totalPriceWithDelivery = totalPriceWithDiscount;
  const isMoreThanMinOrder = totalPrice >= minOrderPrice;

  const freeDeliveryRemain =
    Math.round((freeDeliveryPrice - totalPriceWithoutDelivery) * 100) / 100;

  const roundedTotalPrice = Math.round(totalPriceWithDelivery * 100) / 100;
  return (
    <div className={clsx(styles.footer, className)}>
      <div className={styles.info}>
        {minPrice && (
          <div className={styles.minOrder}>
            {t('minimumOrder')} {minOrderPrice} {tRoot('currency.plShort')}
          </div>
        )}
        {!isFreeDelivery && (
          <div className={styles.freeOrder}>
            <div>{t('freeDeliveryRemain')}:</div>
            <div>
              {freeDeliveryRemain} {tRoot('currency.plShort')}
            </div>
          </div>
        )}
      </div>

      <div className={styles.total}>
        <div className={styles.totalTitle}>{t('total')}:</div>
        <div className={styles.totalValue}>
          {roundedTotalPrice} {tRoot('currency.plShort')}
        </div>
      </div>
    </div>
  );
}
