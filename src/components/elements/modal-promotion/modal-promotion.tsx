'use client';
import clsx from 'clsx';
import styles from './modal-promotion.module.scss';
import CrossIcon from './assets/cross-icon.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useInterval, useSessionStorage, useTimeout } from 'usehooks-ts';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalSettings } from '@/context/global-settings-context';
import RichText from '../RichText';
import dayjs from '@/libs/dayjs';
import getDayName from '@/utils/get-day-name';
interface ModalPromotionProps {}
const SHOW_INTERVAL: number | null = 1000 * 60 * 5;
export default function ModalPromotion({}: ModalPromotionProps): JSX.Element | null {
  const {
    modalPromotion: {
      backgroundImage,
      cta,
      description,
      title,
      declineText,
      isActive,
    },
    workingHours,
  } = useGlobalSettings();
  const [isModalOpen, setIsModalOpen] = useSessionStorage(
    'modal-promotion-is-open',
    true
  );

  useEffect(() => {
    if (!isModalOpen) return;
    const currentTime = dayjs();
    const currentDayName = getDayName(currentTime.day());
    const currentDayWorkingHours = workingHours?.[currentDayName];
    if (!currentDayWorkingHours) return;
    const isWithinWorkingHours =
      !currentDayWorkingHours ||
      currentTime.isBetween(
        dayjs(currentDayWorkingHours[0], 'HH:mm'),
        dayjs(currentDayWorkingHours[1], 'HH:mm'),
        'minutes'
      );

    isWithinWorkingHours ? setIsModalOpen(true) : setIsModalOpen(false);
  }, [isModalOpen, setIsModalOpen, workingHours]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);
  useTimeout(
    () => setIsModalOpen(true),
    isActive && !isModalOpen ? SHOW_INTERVAL : null
  );
  const bgImageSrc =
    typeof backgroundImage === 'object'
      ? (backgroundImage.url as string)
      : backgroundImage;

  if (!isActive) return null;
  return (
    <div
      className={clsx(styles.modal, {
        [styles.hidden]: !isModalOpen,
      })}
    >
      <div className={styles.content}>
        <button className={styles.closeBtn} onClick={handleModalClose}>
          <CrossIcon />
        </button>
        <div className={styles.body}>
          <RichText className={styles.title} content={title} />
          <RichText className={styles.description} content={description} />
          <Link
            href={cta.link}
            className={styles.link}
            onClick={handleModalClose}
          >
            {cta.text}
          </Link>
          {!!declineText && (
            <button className={styles.closeLink} onClick={handleModalClose}>
              {declineText}
            </button>
          )}
          {backgroundImage && (
            <picture className={styles.bg}>
              {/* <source
              srcSet="/img/modal-promo@2.jpg"
              media="(max-width: 1199px)"
            /> */}
              <Image src={bgImageSrc} alt="" fill />
            </picture>
          )}
        </div>
      </div>
      <div className={styles.overlay} onClick={handleModalClose} />
    </div>
  );
}
