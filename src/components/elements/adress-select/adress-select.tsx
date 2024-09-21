import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useField } from 'formik';
import { useOnClickOutside } from 'usehooks-ts';
import Spinner from '../spinner/spinner';

import styles from './adress-select.module.scss';
import axios from 'axios';
import useCart from '@/hooks/use-cart';
import { useTranslation } from 'next-i18next';
import useStreetPredictions from '@/hooks/use-street-predictions';

interface AdressSelectProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
const isAddressValid = async (address: string) =>
  await axios
    .post(
      process.env.NEXT_PUBLIC_SERVER_URL + '/api/delivery/get-zone-by-address',
      {
        address,
      }
    )
    .then(res => res.data);

export default function AdressSelect({ inputProps }): JSX.Element {
  const [fieldName, metaName, helpersName] = useField('streetName');
  const [fieldId, metaId, helpersId] = useField('streetId');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<
    (typeof predictions)[0] | null
  >(null);
  const { predictions, isLoading: isPredictionsLoading } = useStreetPredictions(
    fieldName.value
  );
  const dropdownRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const { t: tRoot } = useTranslation('common');

  const handlePredictionClick = async (prediction: (typeof predictions)[0]) => {
    setIsOpen(false);
    setSelectedValue(prediction);
    helpersName.setValue(prediction.name);
    helpersId.setValue(prediction.id);
    console.log(prediction);
  };

  const clearSelection = () => {
    setSelectedValue(null);
    helpersName.setValue('');
    helpersId.setValue('');
  };

  return selectedValue ? (
    <div className={styles.selectedValue}>
      {selectedValue.name}
      <button onClick={clearSelection}>&times;</button>
    </div>
  ) : (
    <div className={styles.field} onClick={() => setIsOpen(!isOpen)}>
      {metaName.error && metaName.touched && (
        <div className={styles.marker}>!</div>
      )}
      {isPredictionsLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {!selectedValue && (
        <input
          {...inputProps}
          {...fieldName}
          className={clsx(styles.input, {
            [styles.error]: metaName.error && metaName.touched,
          })}
        />
      )}
      {isOpen && predictions.length !== 0 && (
        <ul className={styles.dropdown} ref={dropdownRef}>
          {predictions.map(prediction => (
            <li
              key={prediction.id}
              onClick={() => handlePredictionClick(prediction)}
            >
              {prediction.name}
            </li>
          ))}
        </ul>
      )}
      <input {...fieldId} type="hidden" />
      {/* {deliveryPrice !== 0 && (
        <div className={styles.price}>
          <span>{tRoot('delivery.type.delivery')}:</span>
          {deliveryPrice} {tRoot('currency.plShort')}
        </div>
      )} */}
    </div>
  );
}
