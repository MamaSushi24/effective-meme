'use client';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

import styles from './cart.module.scss';
import CartIcon from './assets/cart-icon.svg';
import useCart from '@/hooks/use-cart';
import {
  useIsFirstRender,
  useIsomorphicLayoutEffect,
  useOnClickOutside,
} from 'usehooks-ts';
import { Group, Product } from '@/types/payload-types';
import dynamic from 'next/dynamic';

const CartThanks = dynamic(() =>
  import('./cart-thanks/cart-thanks').then(module => module.default)
);
const CartSummary = dynamic(() =>
  import('./cart-summary/cart-summary').then(module => module.default)
);
const CartLoading = dynamic(() =>
  import('./cart-loading/cart-loading').then(module => module.default)
);
const CartPending = dynamic(() =>
  import('./cart-pending/cart-pending').then(module => module.default)
);
const CartDelivery = dynamic(() =>
  import('./cart-delivery/cart-delivery').then(module => module.default)
);
const CartOrder = dynamic(() =>
  import('./cart-order/cart-order').then(module => module.default)
);
interface CartProps {}
export default function Cart({}: CartProps): JSX.Element {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartState, setCartState] = useState<
    'default' | 'delivery' | 'summary' | 'success' | 'pending'
  >('default');
  const {
    quantity,
    loading,
    inititalState,
    cleanCart,
    verifyOrderStatusData,
    saveOrderInStore,
    items,
    cartState: cartGlobalState,
    totalPriceWithDiscount,
    deliveryPrice,
    storedOrder,
  } = useCart();

  const prevQuantity = useRef(quantity);
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, () => setIsCartOpen(false));
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (verifyOrderStatusData && verifyOrderStatusData.status === 'pending') {
      setIsCartOpen(true);
      setCartState('pending');
    }
    if (verifyOrderStatusData && verifyOrderStatusData.status === 'paid') {
      setIsCartOpen(true);
      setCartState('success');
      saveOrderInStore(null);
      fbq('track', 'Purchase', {
        value: verifyOrderStatusData.total,
        currency: 'PLN',
      });
      const orderItems = verifyOrderStatusData?.order?.cartLines?.map(item => {
        const itemData = item?.product as Product;
        const itemGroup = itemData?.parentGroup as Group;
        return {
          item_name: itemData?.nameSyrve,
          item_id: itemData?.id,
          price: itemData.price,
          item_brand: 'MAMA Sushi',
          item_category: itemGroup?.nameSyrve,
          quantity: item.quantity,
        };
      });
      // @ts-expect-error
      window?.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          // 'transaction_id': ,
          payment_type: verifyOrderStatusData?.order?.payment?.type,
          value: verifyOrderStatusData?.order?.totalWithDelivery,
          currency: 'PLN',
          tax: 0,
          shipping: verifyOrderStatusData?.order?.deliveryPrice,
          coupon: verifyOrderStatusData?.order?.discountCode,
          items: orderItems,
        },
      });
    }
    if (verifyOrderStatusData && verifyOrderStatusData.status === 'canceled') {
      setIsCartOpen(true);
      setCartState('default');
      saveOrderInStore(null);
    }
  }, [saveOrderInStore, verifyOrderStatusData]);

  const handleCartToggle = () => {
    if (isCartOpen)
      gsap.fromTo(
        modalRef.current,
        { opacity: 1, scale: 1, transformOrigin: 'top right' },
        {
          opacity: 0,
          scale: 0,
          duration: 0.3,
          onComplete: () => {
            setIsCartOpen(false);
          },
        }
      );
    else {
      setIsCartOpen(true);
      if (storedOrder) {
        saveOrderInStore(null);
        setCartState('default');
      }
    }
  };

  // Animation on cart open
  useIsomorphicLayoutEffect(() => {
    if (!modalRef.current) return;
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0, transformOrigin: 'top right' },
      {
        opacity: 1,
        scale: 1,
        duration: 0.3,
      }
    );
  }, [isCartOpen, isFirstRender]);

  // Animation on cart quantity change
  useIsomorphicLayoutEffect(() => {
    if (inititalState || quantity === prevQuantity.current) return;
    gsap
      .timeline({
        onStart: () => {
          prevQuantity.current = quantity;
        },
      })
      .fromTo(
        '[data-anim="cart-icon"]',
        {
          rotate: 0,
        },
        {
          rotate: 20,
          yoyo: true,
          repeat: 1,
        }
      )
      .fromTo(
        '[data-anim="cart-quantity"]',
        {
          scale: 1,
          transformOrigin: 'top right',
        },
        {
          scale: 2,
          yoyo: true,
          repeat: 1,
        },
        '<'
      );
  }, [quantity, loading, isFirstRender]);

  useEffect(() => {
    const body = document.body;
    if (isCartOpen) {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
    }
    return () => {
      body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  const handleSuccesClose = () => {
    cleanCart();
    setIsCartOpen(false);
    setCartState('default');
  };

  const handleCloseIsPending = () => {
    // cleanCart();
    setCartState('default');
    setIsCartOpen(false);
  };

  // Fire analytics events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (cartState === 'delivery') {
      fbq && fbq('track', 'InitiateCheckout');
      // Google Analytics
      {
        const itemsCheckout = items.map(item => ({
          item_name: item.productData.nameSyrve,
          item_id: item.productData.id,
          price: item.productData.price,
          item_brand: 'MAMA Sushi',
          item_category: (item.productData.parentGroup as Group)?.nameSyrve,
          quantity: item.quantity,
        }));

        // @ts-expect-error
        window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
        // @ts-expect-error
        window?.dataLayer?.push({
          event: 'begin_checkout',
          ecommerce: {
            items: itemsCheckout,
          },
        });
      }
    }
    if (cartState === 'summary') {
      const itemsCheckout = items.map(item => ({
        item_name: item.productData.nameSyrve,
        item_id: item.productData.id,
        price: item.productData.price,
        item_brand: 'MAMA Sushi',
        item_category: (item.productData.parentGroup as Group)?.nameSyrve,
        quantity: item.quantity,
      }));
      // Google Analytics
      {
        // @ts-expect-error
        window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
        // @ts-expect-error
        window?.dataLayer?.push({
          event: 'add_shipping_info',
          ecommerce: {
            items: itemsCheckout,
            shipping_tier: cartGlobalState.delivery.type,
            value: totalPriceWithDiscount + deliveryPrice,
            currency: 'PLN',
          },
        });
      }
    }
  }, [
    cartGlobalState.delivery.type,
    cartState,
    deliveryPrice,
    items,
    totalPriceWithDiscount,
  ]);

  return (
    <>
      <button className={styles.cartButton} onClick={handleCartToggle}>
        <CartIcon data-anim="cart-icon" />
        <span className={styles.cartButtonAmount} data-anim="cart-quantity">
          {quantity}
        </span>
      </button>
      {isCartOpen && (
        <div className={styles.cart} ref={modalRef}>
          {loading && <CartLoading />}
          {cartState === 'success' && (
            <CartThanks onClose={handleSuccesClose} />
          )}

          {cartState === 'delivery' && (
            <CartDelivery
              onBackClick={() => setCartState('default')}
              onNext={() => setCartState('summary')}
              onClose={handleCartToggle}
            />
          )}
          {cartState === 'summary' && (
            <CartSummary
              onNextClick={() => setCartState('success')}
              onBackClick={() => setCartState('delivery')}
              onClose={handleCartToggle}
            />
          )}
          {cartState === 'default' && (
            <CartOrder
              onClose={handleCartToggle}
              onNext={() => {
                setCartState('delivery');
              }}
            />
          )}
          {cartState === 'pending' && (
            <CartPending onClose={handleCloseIsPending} />
          )}
        </div>
      )}
    </>
  );
}
