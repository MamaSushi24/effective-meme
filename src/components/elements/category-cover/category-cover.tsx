import useResponsive from '@/hooks/use-responsive';
import clsx from 'clsx';
import Image from 'next/image';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';

import styles from './category-cover.module.scss';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GroupsHeroesImage } from '@/types/payload-types';
import PictureResponsive from '../picture-responsive/picture-responsive';
import { FALLBACK } from '@/consts/fallbacks';

interface CategoryCoverProps {
  cover: GroupsHeroesImage;
  title: string;
}
export default function CategoryCover({
  cover,
  title,
}: CategoryCoverProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation('common');
  const router = useRouter();
  const slug = router.query.slug;
  const crumbs = [
    {
      label: t('breadcrumb.menu'),
      href: '#',
    },
    {
      label: title,
      href: `#`,
    },
  ];
  const heroImg = {
    mobile: cover?.sizes?.mobile?.url,
    tablet: cover?.sizes?.tablet?.url,
    desktop: cover?.sizes?.desktop?.url || FALLBACK.GROUP_HERO_IMAGE_URL,
  };
  return (
    <section className={styles.section}>
      <div className={styles.bg}>
        <PictureResponsive
          sizes={heroImg}
          ImageProps={{
            sizes: '100vw',
            priority: true,
          }}
        />
      </div>
      {/* {isDesktop && (
        <Breadcrumbs className={styles.breadcrumbs} crumbs={crumbs} />
      )} */}
      {title && <h1 className={styles.title}>{title}</h1>}
    </section>
  );
}
