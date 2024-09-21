import clsx from 'clsx';

import styles from './breadcrumbs.module.scss';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import ROUTES from '@/consts/routes';

interface BreadcrumbsProps {
  className?: string;
  crumbs?: {
    label: string;
    href: string;
  }[];
}
export default function Breadcrumbs({
  className,
  crumbs,
}: BreadcrumbsProps): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <nav className={clsx(className)}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href={ROUTES.HOME.path} className={styles.link}>
            {t(ROUTES.HOME.tKey)}
          </Link>
        </li>
        {crumbs?.map((crumb, idx) => (
          <li
            className={clsx(styles.item, {
              [styles.active]: idx === crumbs.length - 1,
            })}
            key={idx}
          >
            <Link href={crumb.href} className={styles.link}>
              {crumb.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
