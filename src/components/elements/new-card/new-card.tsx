import clsx from 'clsx';
import Link from 'next/link';
import { News } from '@/types/payload-types';

import styles from './new-card.module.scss';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface NewCardProps {
  item: News;
  first?: boolean;
}
export default function NewCard({ item, first }: NewCardProps): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <Link href={`/news/${item.slug}`} className={clsx(styles.newCard)}>
      <div className={styles.img}>
        <picture className={styles.img}>
          <source
            // @ts-ignore
            srcSet={item.coverImgMobile.url}
            media="(max-width: 744px)"
          />
          <Image
            // @ts-ignore
            src={item.coverImgDesktop.url}
            alt={item.title}
            fill
          />
        </picture>
        {!first && item.title && <h3 className={styles.title}>{item.title}</h3>}
        {!first && <div className={styles.link}>{t('button.more')}</div>}
      </div>
    </Link>
  );
}
