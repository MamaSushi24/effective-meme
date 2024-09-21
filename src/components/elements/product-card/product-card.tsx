import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../button/button';
import NumberInput from '../number-input/number-input';
import { useTranslation } from 'next-i18next';
import useCart from '@/hooks/use-cart';
import { FALLBACK } from '@/consts/fallbacks';
import VeganIcon from './assets/vegan-icon.svg';
import SpicyIcon from './assets/spicy-icon.svg';
import { Group, Product, ProductsCardsImage } from '@/types/payload-types';
import Image from 'next/image';
import styles from './product-card.module.scss';
import useCurrentTimeInPeriod from '@/hooks/use-current-time-in-period';

interface ProductCardProps {
  data: Product;
  analytics?: {
    list_name?: string;
    list_id?: string;
    index?: number;
    quantity?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ data, analytics }) => {
  const { id, name, price, slug, cardImage, aviabilityHours, vegan, spicy } =
    data;
  const { addProductToCart } = useCart();
  const { t } = useTranslation('common');
  const [quantity, setQuantity] = useState<number>(1);
  const isAvailable = useCurrentTimeInPeriod(
    aviabilityHours as [string, string]
  );
  const onAddToCartDispatchGtmEvent = useCallback(() => {
    if (typeof window === 'undefined') return;
    const productObj = {
      item_name: data.nameSyrve || data.name, // Name or ID is required.
      item_id: data.id,
      item_brand: 'MAMA Sushi',
      item_category: (data.parentGroup as Group).nameSyrve,
      item_list_name: analytics?.list_name,
      item_list_id: analytics?.list_id,
      index: analytics?.index,
      quantity: quantity,
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
    analytics?.index,
    analytics?.list_id,
    analytics?.list_name,
    data.id,
    data.name,
    data.nameSyrve,
    data.parentGroup,
    data.price,
    quantity,
  ]);
  const handlerButtonClick = () => {
    addProductToCart(id, quantity);
    onAddToCartDispatchGtmEvent();
  };
  const dispatchGtmEvent = useCallback(() => {
    if (typeof window === 'undefined') return;
    const productObj = {
      item_name: data.nameSyrve || data.name, // Name or ID is required.
      item_id: data.id,
      item_brand: 'MAMA Sushi',
      item_category: (data.parentGroup as Group).nameSyrve,
      item_list_name: analytics?.list_name,
      item_list_id: analytics?.list_id,
      index: analytics?.index,
      quantity: analytics?.quantity,
      price: data.price,
    };
    // @ts-expect-error
    window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
    // @ts-expect-error
    window?.dataLayer?.push({
      event: 'select_item',
      ecommerce: {
        items: [productObj],
      },
    });
  }, [
    analytics?.index,
    analytics?.list_id,
    analytics?.list_name,
    analytics?.quantity,
    data.id,
    data.name,
    data.nameSyrve,
    data.parentGroup,
    data.price,
  ]);

  return (
    <>
      <div className={styles.card}>
        <Link
          href={{
            pathname: `/product/${slug}`,
            query: {
              item_list_name: analytics?.list_name,
              item_list_id: analytics?.list_id,
              index: analytics?.index,
              quantity: analytics?.quantity,
            },
          }}
          onClick={dispatchGtmEvent}
        >
          <div className={styles.img}>
            <Image
              src={
                (cardImage as ProductsCardsImage)?.url ||
                FALLBACK.PRODUCT_CARD_PREVIEW_IMAGE_URL
              }
              alt={name}
              fill
            />
          </div>
        </Link>
        <div className={styles.content}>
          <div className={styles.title}>{name}</div>
          <div className={styles.price}>
            {price} {t('currency.plShort')}
          </div>
          <NumberInput
            value={quantity}
            onChange={setQuantity}
            className={styles.input}
            inputProps={{
              'aria-label': t('productCard.quantityInput.ariaLabel'),
            }}
          />
          <Button
            label={t('productCard.addToCart')}
            onClick={handlerButtonClick}
            disabled={!isAvailable}
            className={styles.button}
          />
        </div>
        {spicy && (
          <span className={styles.icon}>
            <SpicyIcon />
          </span>
        )}
        {vegan && (
          <span className={styles.icon}>
            <VeganIcon />
          </span>
        )}
      </div>
    </>
  );
};

export default ProductCard;
