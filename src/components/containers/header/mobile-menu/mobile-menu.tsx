import clsx from 'clsx';
import Link from 'next/link';
import { useRef, useState } from 'react';

import styles from './mobile-menu.module.scss';
import BurgerIcon from './assets/burger-icon.svg';
import CloseIcon from './assets/close-icon.svg';
import MenuBg from './assets/menu-bg.svg';
import { useTranslation } from 'next-i18next';
import ROUTES from '@/consts/routes';
import { GlobalSetting } from '@/types/payload-types';
import WorkSchedule, {
  WorkScheduleProps,
} from '@/components/elements/work-schedule/work-schedule';
import { useRouter } from 'next/router';

interface MobileMenuProps {
  data: GlobalSetting;
}
export default function MobileMenu({ data }: MobileMenuProps): JSX.Element {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { workingHours } = data;
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef(null);
  const handleToggleShow = () => {
    setIsOpen(prev => !prev);
  };

  const navItems = [ROUTES.HOME, ROUTES.DELIVERY, ROUTES.ABOUT_US, ROUTES.NEWS];
  return (
    <div>
      <button
        className={styles.button}
        onClick={handleToggleShow}
        aria-label={t('header.mobileMenu.closeButton.ariaLabel')}
        aria-controls="menu"
        aria-expanded={isOpen}
      >
        <BurgerIcon />
      </button>

      {
        <div
          className={clsx(styles.wrap, {
            [styles.active]: isOpen,
          })}
          ref={ref}
        >
          <div className={styles.overlay} onClick={handleToggleShow}></div>
          <div className={styles.menu}>
            <div className={styles.bg}>
              <MenuBg />
            </div>
            <button
              className={styles.closeButton}
              onClick={handleToggleShow}
              aria-label={t('header.mobileMenu.closeButton.ariaLabel')}
              aria-controls="menu"
              aria-expanded={isOpen}
            >
              <CloseIcon />
            </button>
            <nav>
              <ul className={styles.nav} id="menu">
                {navItems.map(e => (
                  <li key={e.path}>
                    {router.pathname !== e.path ? (
                      <Link
                        href={e.path}
                        className={styles.link}
                        prefetch={false}
                      >
                        {t(e.tKey)}
                      </Link>
                    ) : (
                      <span className={clsx(styles.link, styles.active)}>
                        {t(e.tKey)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className={styles.worksHours}>
              <div className={styles.worksHoursTitle}>
                {t('mobileMenu.workingHours')}
              </div>
              <div className={styles.worksHoursList}>
                <WorkSchedule
                  schedule={workingHours as WorkScheduleProps['schedule']}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
