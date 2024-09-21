'use client';

import clsx from 'clsx';
import dayjs from '@/libs/dayjs';
import Portal from '@/hooks/portal';
// import Modal from '@/components/elements/modal/modal';
import styles from './schedule-modal.module.scss';
import { useGlobalSettings } from '@/context/global-settings-context';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import getDayName from '@/utils/get-day-name';
import request, { gql } from 'graphql-request';
import { useTranslation } from 'next-i18next';
import useSWR from 'swr';
import dynamic from 'next/dynamic';

interface ScheduleModalProps {}

const QUERY = gql`
  query ($locale: LocaleInputType!) {
    GlobalSetting(locale: $locale) {
      temporaryClosed
      temporaryClosedMessage
    }
  }
`;
interface Response {
  GlobalSetting: {
    temporaryClosed: boolean;
    temporaryClosedMessage: string;
  };
}

const Modal = dynamic(
  () =>
    import('@/components/elements/modal/modal').then(
      module => module.default
    ),
  { ssr: false }
);
export default function ScheduleModal({}: ScheduleModalProps): JSX.Element {
  const [showModal, setShowModal] = useSessionStorage(
    'showScheduleModal',
    true
  );
  const { i18n } = useTranslation('common');
  const { workingHours } = useGlobalSettings();
  const { data } = useSWR(
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL + '/api/graphql',
      query: QUERY,
      locale: i18n.language ?? 'pl',
    },
    ({ url, query, locale }) => request<Response>(url, query, { locale }),
    { refreshInterval: 1000 * 60 * 5 }
  );
  useEffect(() => {
    if (!showModal) return;
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

    !isWithinWorkingHours && setShowModal(true);
    isWithinWorkingHours && setShowModal(false);
  }, [setShowModal, showModal, workingHours]);

  const isModalVisible = !!data?.GlobalSetting.temporaryClosed || showModal;
  const customModalText = data?.GlobalSetting.temporaryClosed
    ? data?.GlobalSetting.temporaryClosedMessage
    : undefined;
  const canBeClosed = !data?.GlobalSetting.temporaryClosed;
  return (
    <Portal>
      {isModalVisible && (
        <Modal
          onClose={() => canBeClosed && setShowModal(false)}
          text={customModalText}
          canBeClosed={canBeClosed}
        />
      )}
    </Portal>
  );
}
