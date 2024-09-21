import Image from 'next/image';
import { BREAKPOINTS } from '@/consts/breakpoints';
import styles from './picture-responsive.module.scss';
import clsx from 'clsx';
export interface PictureResponsiveProps {
  alt?: string | null;
  sizes: {
    mobile?: string | null;
    tablet?: string | null;
    desktop: string;
  };
  className?: string;
  ImageProps?: Partial<React.ComponentProps<typeof Image>>;
}
export default function PictureResponsive({
  alt,
  sizes,
  className,
  ImageProps,
}: PictureResponsiveProps): JSX.Element {
  const mediaDesktop = `(min-width: ${BREAKPOINTS.XL}px)`;
  const mediaTablet = `(min-width: ${BREAKPOINTS.MD}px)`;

  return (
    <picture
      className={clsx(className, {
        [styles.fill]:
          ImageProps?.fill === undefined || ImageProps?.fill === true,
      })}
    >
      {sizes.desktop && <source media={mediaDesktop} srcSet={sizes.desktop} />}
      {sizes.tablet && <source media={mediaTablet} srcSet={sizes.tablet} />}
      {sizes.mobile && <source srcSet={sizes.desktop} />}
      <Image src={sizes.desktop} alt={alt || ''} fill {...ImageProps} />
    </picture>
  );
}
