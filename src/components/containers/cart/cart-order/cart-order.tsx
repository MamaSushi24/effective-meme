import Button from '@/components/elements/button/button';
import Counter from '@/components/elements/counter/counter';
import CartHeader from '../cart-header/cart-header';
import CartProduct from '../cart-product/cart-product';

import styles from './cart-order.module.scss';
import useCart, { CartItem } from '@/hooks/use-cart';
import { useTranslation } from 'next-i18next';
import CartFooter from '../cart-footer/cart-footer';
import { LineItemType } from '@/modules/cart/CartLine/ILineItem';
interface CartOrderProps {
  onClose: () => void;
  onNext: () => void;
}

export default function CartOrder({
  onClose,
  onNext,
}: CartOrderProps): JSX.Element {
  const {
    t,
    i18n: { language },
  } = useTranslation('common', {
    keyPrefix: 'cart.order',
  });
  const { items, cartState, cartDispatch } = useCart();
  return (
    <div className={styles.order}>
      <CartHeader
        title={items.length > 0 ? t('title') : t('titleEmpty')}
        onClose={onClose}
        className={styles.header}
      />

      <div className={styles.body}>
        {items.length > 0 ? (
          <div className={styles.list}>
            {items.map((item, idx) => (
              <CartProduct
                key={item.productID + idx}
                data={item}
                canBeDeleted={
                  item.type !== LineItemType.AUTOMATIC_LINE_ITEM &&
                  item.type !== LineItemType.SHIPPING_LINE
                }
                canChangeQuantity={
                  item.type !== LineItemType.AUTOMATIC_LINE_ITEM &&
                  item.type !== LineItemType.SHIPPING_LINE
                }
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>{t('emptyText')}</div>
        )}

        {items.length > 0 && (
          <>
            <div className={styles.details}>
              <div className={styles.detailsItem}>
                <div className={styles.detailsItemTitle}>
                  {t('numberOfPeople')}
                </div>
                <Counter
                  value={cartState.numberOfPeople}
                  onChange={quantity => {
                    cartDispatch({
                      type: 'SET_NUMBER_OF_PEOPLE',
                      payload: {
                        quantity,
                      },
                    });
                  }}
                />
              </div>
              <div className={styles.detailsItem}>
                <div className={styles.detailsItemTitle}>
                  {t('numberOfSticksWithHelper')}
                </div>
                <Counter
                  value={cartState.numberOfSticksWithHelper}
                  onChange={quantity => {
                    cartDispatch({
                      type: 'SET_NUMBER_OF_STICKS_WITH_HELPER',
                      payload: {
                        quantity,
                      },
                    });
                  }}
                  canSetZero
                />
              </div>
            </div>

            <div className={styles.buttonWrap}>
              <Button
                label={t('buttonNext')}
                size="small"
                color="tertiary"
                onClick={onNext}
              />
            </div>
          </>
        )}
      </div>

      <CartFooter className={styles.footer} />
    </div>
  );
}
