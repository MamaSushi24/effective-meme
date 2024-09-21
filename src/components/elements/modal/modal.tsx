import clsx from 'clsx';

import styles from './modal.module.scss';
import CloseIcon from './assets/close-icon.svg';
import WorkSchedule, {
  WorkScheduleProps,
} from '@/components/elements/work-schedule/work-schedule';
import { useGlobalSettings } from '@/context/global-settings-context';
import { useTranslation } from 'next-i18next';

interface ModalProps {
  onClose: () => void;
  text?: string;
  canBeClosed?: boolean;
}
export default function Modal({
  onClose,
  canBeClosed,
  text,
}: ModalProps): JSX.Element {
  const { workingHours } = useGlobalSettings();
  const { t } = useTranslation('common');

  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.body}>
        <div className={styles.accentText}>
          お母さんは今寝ていますので、営業時間内にご注文ください
        </div>
        {canBeClosed && (
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        )}

        <div className={styles.title}>{t('modal.title')}</div>
        <p className={styles.text}>{text || t('modal.text')}</p>
        {!text && (
          <div className={styles.text}>
            <WorkSchedule
              schedule={workingHours as WorkScheduleProps['schedule']}
            />
          </div>
        )}
      </div>
    </div>
  );
}
