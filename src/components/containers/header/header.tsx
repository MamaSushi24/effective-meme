import clsx from 'clsx';
import Link from 'next/link';
import useResponsive from '@/hooks/use-responsive';
import MobileMenu from './mobile-menu/mobile-menu';
import Container from '../../elements/container/container';

import styles from './header.module.scss';
import LocationIcon from './assets/location-icon.svg';
import { GlobalSetting } from '@/types/payload-types';
import ROUTES from '@/consts/routes';
import { useTranslation } from 'next-i18next';
import LangSwitcher from '@/components/elements/lang-switcher/lang-switcher';
import Image from 'next/image';
import { useRouter } from 'next/router';
interface HeaderProps {
  globalSettings: GlobalSetting;
}
export default function Header({ globalSettings }: HeaderProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const router = useRouter();
  const { t } = useTranslation('common');
  const menu = [ROUTES.HOME, ROUTES.DELIVERY, ROUTES.ABOUT_US, ROUTES.NEWS];

  return (
    <>
      <header className={styles.header}>
        <Container className={styles.container}>
          {!isDesktop && (
            <Link
              className={styles.logo}
              href={ROUTES.HOME.path}
              aria-label={t(ROUTES.HOME.tKey)}
              title="Mama Sushi"
            >
              <Image src="/img/logo-light.svg" alt="Mama Sushi" fill priority />
            </Link>
          )}

          {isDesktop && (
            <nav>
              <ul className={styles.nav}>
                {menu.map((item, idx) => (
                  <li key={idx}>
                    {router.pathname !== item.path ? (
                      <Link
                        href={item.path}
                        className={clsx(styles.link)}
                        prefetch={false}
                      >
                        {t(item.tKey)}
                      </Link>
                    ) : (
                      <span className={clsx(styles.link, styles.active)}>
                        {t(item.tKey)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className={styles.location}>
            <LocationIcon />
            {t('header.location')}
          </div>

          <LangSwitcher />

          {!isDesktop && <MobileMenu data={globalSettings} />}
        </Container>
      </header>
    </>
  );
}
