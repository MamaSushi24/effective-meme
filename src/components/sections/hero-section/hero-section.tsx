import Container from '@/components/elements/container/container';
import useResponsive from '@/hooks/use-responsive';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

import styles from './hero-section.module.scss';

interface HeroSectionProps {
  className?: string;
}
export default function HeroSection({
  className,
}: HeroSectionProps): JSX.Element {
  const { isDesktop } = useResponsive();
  const { t } = useTranslation('common');

  return (
    <section className={clsx(styles.section, className)}>
      <video className={styles.bg} autoPlay loop muted playsInline>
        <source src="/video/video.mp4" type="video/mp4" />
        <source src="/video/video.webm" type="video/webm" />
      </video>
      <Container>
        <div className={styles.inner}>
          <span className={clsx(styles.accentText, styles.first)}>
            ワルシャワのリトル・ジャパン
          </span>
          <span className={clsx(styles.accentText, styles.second)}>
            日本からのプレミアム直送
          </span>
          <span className={clsx(styles.accentText, styles.third)}>
            本物の日本人ママのロールケーキ
          </span>
          <h1 className={styles.title}>Mamasushi</h1>
          <p className={styles.text}>{t('section.hero.subtitle')}</p>
        </div>
      </Container>
    </section>
  );
}
