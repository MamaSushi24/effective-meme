import Container from '@/components/elements/container/container';
import Socials from '@/components/elements/socials/socials';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';

import styles from './footer.module.scss';
import VisaIcon from './assets/visa-icon.svg';
import MasterCardIcon from './assets/master-card-icon.svg';
import GooglePayIcon from './assets/google-pay-icon.svg';
import ApplePayIcon from './assets/apple-pay-icon.svg';
import { useTranslation } from 'next-i18next';
import ROUTES from '@/consts/routes';
import { GlobalSetting } from '@/types/payload-types';
import WorkSchedule, {
  WorkScheduleProps,
} from '@/components/elements/work-schedule/work-schedule';
import { useRouter } from 'next/router';

interface FooterProps {
  data: GlobalSetting;
}
export default function Footer({ data }: FooterProps): JSX.Element {
  const { phone, address, instagramLink, facebookLink } = data;
  const router = useRouter();
  const { t } = useTranslation('common');
  const subMenu = [ROUTES.TERMS_AND_CONDITIONS, ROUTES.PRIVACY_POLICY];
  const menu = [ROUTES.HOME, ROUTES.DELIVERY, ROUTES.ABOUT_US, ROUTES.NEWS];
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.bg}>
          <Image src="/img/footer-bg.jpg" alt="" fill />
        </div>
        <div className={styles.blocks}>
          <div className={styles.block}>
            <div className={styles.title}>
              mama
              <span>ママから教わった本格的な日本料理</span>
            </div>

            <div className={styles.group}>
              <ul className={styles.menu}>
                {subMenu.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      target="_blank"
                      href={item.path}
                      prefetch={false}
                      className={styles.link}
                    >
                      {t(item.tKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.group}>
              <div className={styles.groupTitle}>
                {t('footer.recevingOrders')}:
              </div>
              <div className={styles.list}>
                {phone &&
                  phone.map(e => {
                    return (
                      <p key={e.id}>
                        <a href={`tel:${e}`}>{e.number}</a>
                      </p>
                    );
                  })}

                <WorkSchedule
                  schedule={data.workingHours as WorkScheduleProps['schedule']}
                />
              </div>
            </div>
            <div className={styles.group}>
              <div className={styles.groupTitle}>{t('footer.direction')}:</div>
              <p>{address}</p>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.title}>
              sushi
              <span>ワルシャワへのロールケーキのプレミアム・デリバリー</span>
            </div>
            <div className={styles.group}>
              <div className={styles.groupTitle}>{t('footer.navigation')}:</div>
              <ul className={styles.menu}>
                {menu.map((item, idx) => (
                  <li key={idx}>
                    {router.pathname !== item.path ? (
                      <Link href={item.path} className={styles.link}>
                        {t(item.tKey)}
                      </Link>
                    ) : (
                      <span className={clsx(styles.link)}>{t(item.tKey)}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.group}>
              <div className={styles.groupTitle}>{t('footer.socials')}:</div>
              <Socials instagram={instagramLink} facebook={facebookLink} />
            </div>
            <div className={styles.group}>
              <div className={styles.groupTitle}>
                {t('footer.paymentMethods')}:
              </div>
              <ul className={styles.payments}>
                <li>
                  <VisaIcon />
                </li>
                <li>
                  <MasterCardIcon />
                </li>
                <li>
                  <GooglePayIcon />
                </li>
                <li>
                  <ApplePayIcon />
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.logo}>
            <Image src="/img/logo-light.svg" alt="Mama Sushi" fill />
          </div>
        </div>
      </footer>
    </>
  );
}
