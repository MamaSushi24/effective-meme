import clsx from 'clsx';
import Button from '../button/button';
import Container from '../container/container';
import NumberInput from '../number-input/number-input';

import styles from './product-info.module.scss';
import { useTranslation } from 'next-i18next';
import { use, useCallback, useLayoutEffect, useState } from 'react';
import { Group, Product } from '@/types/payload-types';
import useCart from '@/hooks/use-cart';
import AllergenIcon from '../allergen-icon/allergen-icon';
import useCurrentTimeInPeriod from '@/hooks/use-current-time-in-period';

interface ProductInfoProps {
  data: Product;
}
export default function ProductInfo({ data }: ProductInfoProps): JSX.Element {
  const { t } = useTranslation('common', {
    keyPrefix: 'productPage',
  });
  const { t: tRoot } = useTranslation('common');
  const [addToCartCounter, setAddToCartCounter] = useState(1);
  const { addProductToCart } = useCart();
  const { name, price, composition, quantity, allergens, id, aviabilityHours } =
    data;
  const isAvailable = useCurrentTimeInPeriod(
    aviabilityHours as [string, string]
  );
  const onAddToCartDispatchGtmEvent = useCallback(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const item_list_name = searchParams.get('item_list_name');
    const item_list_id = searchParams.get('item_list_id');
    const index = searchParams.get('index');
    const productObj = {
      item_name: data.nameSyrve || data.name, // Name or ID is required.
      item_id: data.id,
      item_brand: 'MAMA Sushi',
      item_category: (data.parentGroup as Group).nameSyrve,
      item_list_name: item_list_name || undefined,
      item_list_id: item_list_id || undefined,
      index: index ? parseInt(index) : undefined,
      quantity: addToCartCounter,
      price: data.price,
    };

    // Measure when a product is added to a shopping cart
    // @ts-expect-error
    window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
    // @ts-expect-error
    window?.dataLayer?.push({
      event: 'add_to_cart',
      ecommerce: {
        items: [productObj],
      },
    });
  }, [
    addToCartCounter,
    data.id,
    data.name,
    data.nameSyrve,
    data.parentGroup,
    data.price,
  ]);
  const handleAddToCart = useCallback(() => {
    addProductToCart(id, addToCartCounter);
    setAddToCartCounter(1);
    onAddToCartDispatchGtmEvent();
  }, [addProductToCart, addToCartCounter, id, onAddToCartDispatchGtmEvent]);

  return (
    <>
      <section className={styles.section}>
        <Container className={styles.container}>
          <div className={styles.col}>
            {/* <Breadcrumbs className={styles.breadcrumbs} /> */}
            <h1 className={styles.title}>{name}</h1>
          </div>
          <div className={styles.col}>
            <ul className={styles.info}>
              {composition && (
                <li className={styles.infoItem}>
                  <span>{t('composition')}</span>
                  <span>{composition}</span>
                </li>
              )}
              {allergens?.length !== 0 && (
                <li className={clsx(styles.infoItem, styles.alignCenter)}>
                  <span>{t('allergens')}</span>
                  <div className={styles.allergens}>
                    {allergens?.map((allergen, idx) => (
                      <AllergenIcon props={allergen} key={idx} />
                    ))}
                  </div>
                </li>
              )}

              {quantity && (
                <li className={styles.infoItem}>
                  <span>{t('quantity')}</span>
                  <span>{quantity}</span>
                </li>
              )}
              <li className={styles.infoItem}>
                <span>{t('price')}</span>
                <span>
                  {price} {tRoot('currency.plShort')}
                </span>
              </li>
            </ul>
            <div className={styles.buttons}>
              <NumberInput
                value={addToCartCounter}
                onChange={setAddToCartCounter}
                inputProps={{
                  'aria-label': t('quantityInput.ariaLabel'),
                }}
              />
              <Button
                disabled={!isAvailable}
                label={t('addToCart')}
                onClick={handleAddToCart}
                aria-label={t('addToCart')}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
