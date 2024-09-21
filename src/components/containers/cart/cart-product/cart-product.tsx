import Counter from '@/components/elements/counter/counter';
import clsx from 'clsx';

import styles from './cart-product.module.scss';
import RemoveIcon from '../assets/close-icon.svg';
import useCart, { CartItem } from '@/hooks/use-cart';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback } from 'react';

interface CartProductProps {
  data: CartItem;
  canChangeQuantity?: boolean;
  canBeDeleted?: boolean;
}
export default function CartProduct({
  data,
  canBeDeleted = true,
  canChangeQuantity = true,
}: CartProductProps): JSX.Element {
  const { t } = useTranslation('common');
  const { cartDispatch } = useCart();
  const { productID, quantity, productData } = data;
  const handleRemove = useCallback(
    () =>
      cartDispatch({
        type: 'REMOVE_ITEM',
        payload: {
          productID: productID,
        },
      }),
    [productID, cartDispatch]
  );
  return (
    <div className={styles.product}>
      <div className={styles.productInfo}>
        <div className={styles.proudctImage}>
          {productData.cardImage && (
            <Image
              src={
                typeof productData.cardImage === 'string'
                  ? productData.cardImage
                  : productData.cardImage?.url ?? ''
              }
              alt=""
              width={80}
              height={80}
            />
          )}
        </div>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{productData.name}</div>
          {productData.quantity && (
            <div className={styles.productAmount}>
              {`//`} {productData.quantity}
              &nbsp;{t('amount.label')}
            </div>
          )}
        </div>
      </div>
      {canChangeQuantity ? (
        <Counter
          value={data.quantity}
          onChange={quantity =>
            cartDispatch({
              type: 'SET_ITEM_QUANTITY',
              payload: {
                productID,
                quantity,
              },
            })
          }
        />
      ) : (
        <span></span>
      )}
      <div className={styles.productPrice}>
        {data.finalLinePrice} {t('currency.plShort')}
      </div>
      {canBeDeleted ? (
        <button className={styles.removeButton} onClick={handleRemove}>
          <RemoveIcon />
        </button>
      ) : (
        <span></span>
      )}
    </div>
  );
}
