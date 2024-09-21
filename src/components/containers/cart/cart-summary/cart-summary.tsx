import useCart, { CartItem } from '@/hooks/use-cart';
import CartHeader from '../cart-header/cart-header';

import styles from './cart-summary.module.scss';
import Button from '@/components/elements/button/button';
import { Trans, useTranslation } from 'next-i18next';
import CartFooter from '../cart-footer/cart-footer';
import Image from 'next/image';
import Promocode from '../promocode/promocode';
import ROUTES from '@/consts/routes';
import Link from 'next/link';
import request, { gql } from 'graphql-request';
import { useEffect, useState } from 'react';
import AppliedDiscounts from './applied-discounts/applied-discounts';

interface CartSummaryProps {
  onClose: () => void;
  onBackClick: () => void;
  onNextClick: () => void;
}

export default function CartSummary({
  onClose,
  onBackClick,
  onNextClick,
}: CartSummaryProps): JSX.Element {
  const {
    t: tRoot,
    i18n: { language },
  } = useTranslation('common');
  const {
    cartState,
    placeOrder,
    items,
    deliveryPrice,
    saveOrderInStore,
    discountCode,
    totalPriceWithDiscount,
    discountStrategiesApplied,
    setOrderNumber,
  } = useCart();

  const handlePlaceOrder = () => {
    placeOrder().then(res => {
      if (res.status === 'ok') {
        if (res.order.payment.type !== 'online') {
          setOrderNumber(res.order.orderId);
          onNextClick();

          // Fire FB event
          fbq('track', 'Purchase', {
            value: res.order.totalWithDelivery,
            currency: 'PLN',
          });

          // Fire GTM event
          {
            const orderItems = res?.order?.cartLines?.map(item => ({
              item_name: item?.product?.nameSyrve,
              item_id: item.product.id,
              price: item.product.price,
              item_brand: 'MAMA Sushi',
              item_category: item.product?.parentGroup?.nameSyrve,
              quantity: item.quantity,
            }));

            // @ts-expect-error
            window?.dataLayer.push({
              event: 'purchase',
              ecommerce: {
                // 'transaction_id': ,
                payment_type: cartState.payment.type,
                value: res.order.totalWithDelivery,
                currency: 'PLN',
                tax: 0,
                shipping: res?.order?.deliveryPrice,
                coupon: res?.order?.discountCode,
                items: orderItems,
              },
            });
          }
          return;
        }
        if (res.order.payment.type === 'online') {
          saveOrderInStore({
            orderId: res.order.id,
            status: res.order.status,
            orderNumber: res.order.orderId,
          });

          // Fire FB event
          fbq('track', 'AddPaymentInfo');

          window.location.replace(res.order.payment.link);
        }
      }
    });
  };

  return (
    <div className={styles.summary}>
      <CartHeader
        title={tRoot('cart.summary.main.title')}
        onBackClick={onBackClick}
        onClose={onClose}
        className={styles.header}
      />
      <div className={styles.body}>
        <div className={styles.group}>
          <div className={styles.groupTitle}>{tRoot('cart.summary.title')}</div>
          <ul className={styles.list}>
            {items.map((product, idx) => (
              <li key={product.productData.id + idx} className={styles.product}>
                <div className={styles.productInfo}>
                  <div className={styles.proudctImage}>
                    {typeof product.productData ===
                    'string' ? null : typeof product.productData.cardImage ===
                      'string' ? (
                      <Image src={product.productData.cardImage} alt="" fill />
                    ) : product.productData.cardImage?.url ? (
                      <Image
                        src={product.productData.cardImage.url}
                        alt=""
                        fill
                      />
                    ) : null}
                  </div>
                  <div className={styles.productDetails}>
                    <div className={styles.productTitle}>
                      {typeof product.productData === 'string'
                        ? product.productData
                        : product.productData.name || ''}
                    </div>
                    <div className={styles.productAmnt}>
                      {typeof product.productData === 'string'
                        ? `${product.productData} ${tRoot('amount.label')}`
                        : product.productData.quantity
                          ? `${product.productData.quantity} ${tRoot(
                              'amount.label'
                            )}`
                          : ''}
                    </div>
                  </div>
                </div>

                <div className={styles.productGroup}>
                  <div className={styles.productAmount}>
                    {product.quantity} {tRoot('amount.label')}
                  </div>
                  <span className={styles.oldPrice}>
                    {product.finalPrice !== product.productData.price && (
                      <>
                        {product.originalLinePrice} {tRoot('currency.plShort')}
                      </>
                    )}
                  </span>
                  <div className={styles.productPrice}>
                    {product.finalLinePrice === 0 ? (
                      'FREE'
                    ) : (
                      <>
                        {product.finalLinePrice} {tRoot('currency.plShort')}
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}

            {/* {freeProductCartLine && (
              <li
                key={freeProductCartLine.productData.id}
                className={styles.product}
              >
                <div className={styles.productInfo}>
                  <div className={styles.proudctImage}>
                    {typeof freeProductCartLine.productData ===
                    'string' ? null : typeof freeProductCartLine.productData
                        .cardImage === 'string' ? (
                      <Image
                        src={freeProductCartLine.productData.cardImage}
                        alt=""
                        fill
                      />
                    ) : freeProductCartLine.productData.cardImage?.url ? (
                      <Image
                        src={freeProductCartLine.productData.cardImage.url}
                        alt=""
                        fill
                      />
                    ) : null}
                  </div>
                  <div className={styles.productDetails}>
                    <div className={styles.productTitle}>
                      {typeof freeProductCartLine.productData === 'string'
                        ? freeProductCartLine.productData
                        : freeProductCartLine.productData.name || ''}
                    </div>
                    <div className={styles.productAmnt}>
                      {typeof freeProductCartLine.productData === 'string'
                        ? `${freeProductCartLine.productData} ${tRoot(
                            'amount.label'
                          )}`
                        : freeProductCartLine.productData.quantity
                          ? `${
                              freeProductCartLine.productData.quantity
                            } ${tRoot('amount.label')}`
                          : ''}
                    </div>
                  </div>
                </div>

                <div className={styles.productGroup}>
                  <div className={styles.productAmount}>
                    {freeProductCartLine.quantity} {tRoot('amount.label')}
                  </div>
                  <div className={styles.productPrice}>
                    {freeProductCartLine.productData.price}{' '}
                    {tRoot('currency.plShort')}
                  </div>
                </div>
              </li>
            )} */}
          </ul>
        </div>
        {discountStrategiesApplied.length > 0 && (
          <AppliedDiscounts list={discountStrategiesApplied} />
        )}
        <div className={styles.group}>
          <div className={styles.groupTitle}>
            {tRoot('cart.summary.contactData.title')}
          </div>
          <div className={styles.list}>
            <ul className={styles.list}>
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.contactData.name')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.customer.name}
                </span>
              </li>
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.contactData.phone')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.customer.phone}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.groupTitle}>
            {tRoot('cart.summary.delivery.title')}
          </div>
          <ul className={styles.list}>
            <li>
              <span className={styles.listItemTitle}>
                {tRoot('cart.summary.delivery.type')}:
              </span>
              <span className={styles.listItemValue}>
                {cartState.delivery.type === 'self'
                  ? tRoot('delivery.type.self')
                  : tRoot('delivery.type.delivery')}
              </span>
            </li>
            {cartState.delivery.address && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.delivery.address')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.delivery.address}
                </span>
              </li>
            )}
            {cartState.delivery.floor && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.delivery.floor')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.delivery.floor}
                </span>
              </li>
            )}
            {cartState.delivery.flat && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.delivery.flat')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.delivery.flat}
                </span>
              </li>
            )}
            {cartState.delivery.postcode && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.delivery.field.postcode')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.delivery.postcode}
                </span>
              </li>
            )}
            {cartState.delivery.date && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.summary.delivery.data')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.delivery.date === 'today'
                    ? tRoot('cart.delivery.select.date.option.today')
                    : cartState.delivery.date}
                </span>
              </li>
            )}

            <li>
              <span className={styles.listItemTitle}>
                {tRoot('cart.summary.delivery.time')}:
              </span>
              {cartState.delivery.time === '' ||
              cartState.delivery.time === 'now' ? (
                <span className={styles.listItemValue}>
                  {tRoot('cart.delivery.select.time.option.asSoonAsPossible')}
                </span>
              ) : (
                <span className={styles.listItemValue}>
                  {cartState.delivery.time}
                </span>
              )}
            </li>

            {cartState.comments.CLIENT_COMMENT && (
              <li>
                <span className={styles.listItemTitle}>
                  {tRoot('cart.delivery.field.comment')}:
                </span>
                <span className={styles.listItemValue}>
                  {cartState.comments.CLIENT_COMMENT.split(':', 2)[1].trim()}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.group}>
          <div className={styles.groupTitle}>
            {tRoot('cart.summary.payment.title')}
          </div>
          <ul className={styles.list}>
            <li>
              <span className={styles.listItemTitle}>
                {tRoot('cart.summary.payment.type')}:
              </span>
              <span className={styles.listItemValue}>
                {cartState.payment.type === 'cash'
                  ? tRoot('payment.type.cash')
                  : cartState.payment.type === 'terminal'
                    ? tRoot('payment.type.terminal')
                    : cartState.payment.type === 'online'
                      ? tRoot('payment.type.online')
                      : 'Unknown Payment Type'}
              </span>
            </li>
            <li>
              <span className={styles.listItemTitle}>
                {tRoot('cart.summary.payment.deliverPrice')}:
              </span>
              <span className={styles.listItemValue}>
                {deliveryPrice} {tRoot('currency.plShort')}
              </span>
            </li>
          </ul>
        </div>
        {cartState.delivery.type === 'delivery' && (
          <Promocode className={styles.promocode} />
        )}
        <div className={styles.agreement}>
          <Trans
            t={tRoot}
            i18nKey={'cart.agreement'}
            components={[
              <Link
                href={ROUTES.TERMS_AND_CONDITIONS.path}
                key={ROUTES.TERMS_AND_CONDITIONS.path}
                target="_blank"
              />,
              <Link
                href={ROUTES.PRIVACY_POLICY.path}
                key={ROUTES.PRIVACY_POLICY.path}
                target="_blank"
              />,
            ]}
          />
        </div>
        <Button
          label={tRoot('cart.summary.buttonOrder')}
          size="small"
          color="tertiary"
          onClick={handlePlaceOrder}
          className={styles.button}
        />
      </div>

      <CartFooter minPrice={false} />
    </div>
  );
}
