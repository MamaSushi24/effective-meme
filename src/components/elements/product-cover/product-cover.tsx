import clsx from 'clsx';

import styles from './product-cover.module.scss';
import { ProductsHeroesImage } from '@/types/payload-types';
import PictureResponsive, {
  PictureResponsiveProps,
} from '../picture-responsive/picture-responsive';
import { FALLBACK } from '@/consts/fallbacks';

interface ProductCoverProps {
  cover: ProductsHeroesImage;
  alt: string;
}
export default function ProductCover({
  cover,
  alt,
}: ProductCoverProps): JSX.Element {
  const sizes: PictureResponsiveProps['sizes'] = {
    mobile: cover?.sizes?.mobile?.url,
    tablet: cover?.sizes?.tablet?.url,
    desktop: cover?.sizes?.desktop?.url || FALLBACK.PRODUCT_HERO_IMAGE_URL,
  };
  return (
    <section className={styles.section}>
      <PictureResponsive
        alt={alt}
        sizes={sizes}
        ImageProps={{
          sizes: '100vw',
          quality: 100,
          priority: true,
        }}
      />
    </section>
  );
}
