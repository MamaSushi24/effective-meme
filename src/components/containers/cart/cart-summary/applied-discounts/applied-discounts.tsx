import clsx from 'clsx';

import styles from './applied-discounts.module.scss';
import { useTranslation } from 'next-i18next';

interface AppliedDiscountsProps {
  list: { id: string; title: string }[];
  className?: string;
}
export default function AppliedDiscounts({
  className,
  list,
}: AppliedDiscountsProps): JSX.Element {
  const { t } = useTranslation('common');
  return (
    <div className={clsx(className, styles.container)}>
      <div className={styles.title}>{t('cart.summary.discountsApplied')}</div>
      <div className={styles.list}>
        {list.map(item => (
          <div className={styles.item} key={item.id}>
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
