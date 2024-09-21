import Button from '@/components/elements/button/button';
import Container from '@/components/elements/container/container';
import ProductGrid from '@/components/elements/product-grid/product-grid';
import clsx from 'clsx';

import styles from './category-section.module.scss';
import { Group, Media, Product } from '@/types/payload-types';
import useResponsive from '@/hooks/use-responsive';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';

interface CategorySectionProps {
  title?: string;
  products: Product[];
  link?: string;
  headerBackgroundImageDesktop?: string | Media | null;
  headerBackgroundImageMobile?: string | Media | null;
  id: string;
}
export default function CategorySection({
  title,
  products,
  link,
  headerBackgroundImageMobile,
  headerBackgroundImageDesktop,
  id,
}: CategorySectionProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation('common');

  return (
    <>
      <section className={clsx(styles.section, 'section')}>
        <Container>
          {title && (
            <div className={styles.header}>
              {isDesktop
                ? headerBackgroundImageDesktop && (
                    <Image
                      src={
                        typeof headerBackgroundImageDesktop === 'string'
                          ? headerBackgroundImageDesktop
                          : headerBackgroundImageDesktop?.url || ''
                      }
                      alt=""
                      fill
                      sizes="100vw"
                    />
                  )
                : headerBackgroundImageMobile && (
                    <Image
                      src={
                        typeof headerBackgroundImageMobile === 'string'
                          ? headerBackgroundImageMobile
                          : headerBackgroundImageMobile?.url || ''
                      }
                      alt=""
                      fill
                      sizes="100vw"
                    />
                  )}

              <h2 className={styles.title}>{title}</h2>
            </div>
          )}

          <ProductGrid
            products={products}
            analytics={{
              list_name: 'Category Section',
              list_id: id,
            }}
          />
          {link && (
            <div className={styles.footer}>
              <Button
                label={t('productPage.showMore')}
                href={link}
                size="large"
                color="secondary"
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
