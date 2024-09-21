import Container from '@/components/elements/container/container';
import clsx from 'clsx';
import { DeliveryPage } from '@/types/payload-types';
import { useTranslation } from 'next-i18next';

import Button from '@/components/elements/button/button';

import styles from './delivery-section.module.scss';
import TitleBg from './assets/title-desktop.svg';

interface DeliverySectionProps {
  zones?: DeliveryPage['zones'];
  single?: boolean;
}
export default function DeliverySection({
  zones,
  single,
}: DeliverySectionProps): JSX.Element {
  const { t } = useTranslation('common');

  return (
    <section
      className={clsx(
        styles.section,
        { [styles.single]: single },
        { ['section']: single }
      )}
    >
      <Container className={styles.header}>
        <h1 className={styles.title}>
          <TitleBg className={styles.icon} />
          {t('section.delivery.title')}
        </h1>
      </Container>
      <div className={styles.iframe}>
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1wVupsiwaQKpz-4wL6OetvWtM3oBsPUo&ehbc=2E312F&noprof=1"
          width="640"
          height="480"
          title={t('deliveryMap.title')}
          loading="lazy"
        ></iframe>
      </div>
      <Container>
        {/* <h3 className={styles.infoTitle}>Strona główna/Dostawa i płatność</h3> */}
        {zones ? (
          <div className={styles.info}>
            <ul className={styles.infoList}>
              {zones?.map(zone => (
                <li key={zone.id} className={styles.zone}>
                  <div
                    className={styles.zoneColor}
                    style={{ backgroundColor: zone.color }}
                  ></div>
                  <p className={styles.zoneText}>{zone.description}</p>
                </li>
              ))}
            </ul>
            <p className={styles.infoText}>{t('section.delivery.text')}</p>
          </div>
        ) : (
          <Button
            href="delivery"
            label={t('section.delivery.button')}
            color="secondary"
          />
        )}
      </Container>
    </section>
  );
}
