import clsx from 'clsx';

import styles from './promocode.module.scss';
import { useTranslation } from 'next-i18next';
import Button from '@/components/elements/button/button';
import { useCallback, useRef, useState } from 'react';
import useCart from '@/hooks/use-cart';

interface PromocodeProps {
  className?: string;
}
export default function Promocode({ className }: PromocodeProps): JSX.Element {
  const { t } = useTranslation('common', {
    keyPrefix: 'cart.order',
  });
  const { applyDiscountCode } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    'ok' | 'default' | 'error' | 'not-found' | 'already-used'
  >('default');

  const handleApplyDiscountCode = useCallback(() => {
    const input = inputRef.current;

    if (!input) return;

    applyDiscountCode(input.value).then(({ status, error }) => {
      setVerificationStatus(status === 'ok' ? 'ok' : 'error');
      if (status === 'ok') setVerificationStatus('ok');
      if (status !== 'ok') {
        switch (error) {
          case 'not-found':
            setVerificationStatus('not-found');
            break;
          case 'already-used':
            setVerificationStatus('already-used');
            break;
          default:
            setVerificationStatus('error');
        }
      }
    });
  }, [applyDiscountCode]);
  const isErrorMessage =
    verificationStatus === 'error' ||
    verificationStatus === 'not-found' ||
    verificationStatus === 'already-used';
  return (
    <div className={clsx(className, styles.promoCode)}>
      <div className={styles.promoCodeCol}>
        <input
          placeholder={t('promoCodePlacholder')}
          className={clsx(styles.promoCodeInput, {
            [styles.error]: isErrorMessage,
          })}
          disabled={verificationStatus === 'ok'}
          type="text"
          ref={inputRef}
          onBlur={() => {
            if (isErrorMessage) setVerificationStatus('default');
          }}
        />

        {isErrorMessage && (
          <div className={styles.promoCodeError}>
            {t(`promoCode.${verificationStatus}`)}
          </div>
        )}
        {verificationStatus === 'ok' && (
          <div className={styles.promoCodeOk}>{t('promoCode.success')}</div>
        )}
      </div>
      <div className={styles.promoCodeCol}>
        <Button
          className={styles.promoCodeButton}
          label={t('promoCodeButtonText')}
          disabled={verificationStatus === 'ok'}
          size="extra-small"
          color="tertiary"
          onClick={handleApplyDiscountCode}
        />
      </div>
    </div>
  );
}
