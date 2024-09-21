import Container from '@/components/elements/container/container';
import clsx from 'clsx';
import Image from 'next/image';

import styles from './gallery-section.module.scss';
import TitleMobile from './assets/title-mobile.svg';
import TitleDesktop from './assets/title-desktop.svg';
import { useTranslation } from 'next-i18next';
import useResponsive from '@/hooks/use-responsive';

interface GallerySectionProps {
  className?: string;
}
export default function GallerySection({
  className,
}: GallerySectionProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation('common');

  return (
    <section className={clsx(styles.gallerySection, 'section')}>
      <Container>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isDesktop ? (
              <TitleDesktop className={styles.icon} />
            ) : (
              <TitleMobile className={styles.icon} />
            )}
            {t('section.gallery.title')}
          </h2>
        </div>

        <ul className={styles.list}>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-1.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-2.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-3.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-4.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-5.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-6.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-7.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-8.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-9.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-10.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-11.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
          <li className={styles.item}>
            <Image
              src="/img/gallery-img-12.jpg"
              alt=""
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33.3vw"
            />
          </li>
        </ul>
      </Container>
    </section>
  );
}
