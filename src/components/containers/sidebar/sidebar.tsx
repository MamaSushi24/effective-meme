import useResponsive from '@/hooks/use-responsive';
import CategoryButton from './category-button/category-button';

import styles from './sidebar.module.scss';
import { GlobalSetting, Group, Icon } from '@/types/payload-types';
import { FALLBACK } from '@/consts/fallbacks';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
interface SidebarProps {
  className?: string;
  data: GlobalSetting['sidebar'];
}
export default function Sidebar({
  className,
  data,
}: SidebarProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const router = useRouter();
  return (
    <aside className={styles.sidebar}>
      {isDesktop && (
        <div className={styles.header}>
          {router.pathname !== '/' ? (
            <Link href="/" className={styles.logo}>
              <Image src="/img/logo-light.svg" alt="Mama Sushi" fill priority />
            </Link>
          ) : (
            <div className={styles.logo}>
              <Image src="/img/logo-light.svg" alt="Mama Sushi" fill priority />
            </div>
          )}
        </div>
      )}
      <ul className={styles.categories}>
        {data.items?.map(i => {
          const group = i.group as Group;
          const iconURL = (i.icon as Icon)?.url || FALLBACK.SIDEBAR_ICON_URL;
          return (
            <li key={i.id}>
              <CategoryButton
                icon={iconURL}
                name={group.name}
                link={`/group/${group.slug as string}`}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
