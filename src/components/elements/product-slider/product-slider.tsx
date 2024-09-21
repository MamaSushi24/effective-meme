import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import Container from '../container/container';
import ProductCard from '../product-card/product-card';

import styles from './product-slider.module.scss';
import ArrowLeft from './assets/arrow-left.svg';
import ArrowRight from './assets/arrow-right.svg';
import useResponsive from '@/hooks/use-responsive';
import { Group, Product } from '@/types/payload-types';
import { useTranslation } from 'next-i18next';

interface ProductSliderProps {
  className?: string;
  title?: string;
  products: Product[];
  analytics?: {
    listName: string;
    listId: string;
  };
}

export default function ProductSlider({
  className,
  title,
  products,
  analytics,
}: ProductSliderProps): JSX.Element | null {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation('common');
  const swiper = useRef<SwiperRef>(null);

  const handleNextClick = () => {
    swiper.current?.swiper.slideNext();
  };

  const handlePrevClick = () => {
    swiper.current?.swiper.slidePrev();
  };
  // useEffect(() => {
  //   if (typeof window === 'undefined' || !products || products.length === 0)
  //     return;
  //   const items = products.map((product, idx) => {
  //     const categoryName = (product.parentGroup as Group)?.nameSyrve;
  //     const itemName = product.nameSyrve || product.name;

  //     return {
  //       item_name: itemName,
  //       item_id: product.id,
  //       price: product.price,
  //       item_brand: 'MAMA Sushi',
  //       item_category: categoryName,
  //       item_list_name: analytics?.listName || undefined,
  //       item_list_id: analytics?.listId || undefined,
  //       index: idx,
  //       quantity: 1,
  //     };
  //   });
  //   // Measure product views / impressions
  //   // @ts-expect-error
  //   window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
  //   // @ts-expect-error
  //   window?.dataLayer?.push({
  //     event: 'view_item_list',
  //     ecommerce: {
  //       items: items,
  //     },
  //   });
  // }, [analytics?.listId, analytics?.listName, products]);
  if (!products || products.length === 0) return null;

  return (
    <section className={clsx(styles.section, className)}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {isDesktop && (
            <div className={styles.controls}>
              <button
                className={styles.control}
                onClick={handlePrevClick}
                aria-label={t('productSlider.prevButton.ariaLabel')}
              >
                <ArrowLeft />
              </button>
              <button
                className={styles.control}
                onClick={handleNextClick}
                aria-label={t('productSlider.nextButton.ariaLabel')}
              >
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          ref={swiper}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <ProductCard
                data={product}
                analytics={{
                  list_id: analytics?.listId,
                  list_name: analytics?.listName,
                  index: index,
                  quantity: 1,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.footer}>
          {!isDesktop && (
            <div className={styles.controls}>
              <button className={styles.control} onClick={handlePrevClick}>
                <ArrowLeft />
              </button>
              <button className={styles.control} onClick={handleNextClick}>
                <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
