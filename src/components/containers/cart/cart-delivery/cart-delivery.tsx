import CartHeader from '../cart-header/cart-header';

import { Formik, Form, FormikProps, useFormikContext } from 'formik';
import styles from './cart-delivery.module.scss';
import RadioButton from '@/components/elements/radio-button/radio-button';
import { useEffect, useMemo } from 'react';
import Input from '@/components/elements/input/input';
import Checkbox from '@/components/elements/checkbox/checkbox';
import Button from '@/components/elements/button/button';
import Select from '@/components/elements/select/select';
import { useTranslation } from 'next-i18next';
import { useGlobalSettings } from '@/context/global-settings-context';
import dayjs from '@/libs/dayjs';
import validationSchema from '@/validation-schemas/cart-form-schema';
import useCart, { COMMENT_KEYS, ICart } from '@/hooks/use-cart';
import clsx from 'clsx';
import AdressSelect from '@/components/elements/adress-select/adress-select';
import { string } from 'yup';
interface CartDeliveryProps {
  onClose: () => void;
  onBackClick: () => void;
  onNext: () => void;
}

interface Values {
  name: string;
  phone: string;
  delivery: ICart['delivery']['type'];
  do_not_ring_doorbell: boolean;
  leave_by_the_door: boolean;
  do_not_call: boolean;
  streetName: string;
  streetId: string;
  house: string;
  flat: string;
  floor: string;
  postcode: string;
  payment: ICart['payment']['type'];
  time: string | null;
  date: string;
  change: string;
  comment: string;
}
export default function CartDelivery({
  onClose,
  onBackClick,
  onNext,
}: CartDeliveryProps): JSX.Element {
  const {
    cartState,
    deliveryPrice,
    totalPriceWithDiscount,
    cartDispatch,
    items,
  } = useCart();
  const globalSettings = useGlobalSettings();
  const { delivery } = useGlobalSettings();
  const { t } = useTranslation('common', {
    keyPrefix: 'cart.delivery',
  });
  const { t: tRoot } = useTranslation('common');
  // d72d4349-9fb1-41dc-9895-dee00a704fef
  // const isSomePromotionActive = useMemo(() => {
  //   return items.some(item => {
  //     // if (!item.productData.parentGroup) return false;
  //     // const groupId =
  //     //   typeof item.productData.parentGroup === 'string'
  //     //     ? item.productData.parentGroup
  //     //     : item.productData.parentGroup.id;
  //     // return groupId === 'd72d4349-9fb1-41dc-9895-dee00a704fef';
  //     return item.productID === 'a2387806-954d-4761-8219-01583816499f';
  //   });
  // }, [items]);

  const specialDateOptions = useMemo(() => {
    const specialDateOptions = items.reduce((acc, item) => {
      if (
        item.productData.availableOnlyForSpecifiedDays &&
        item.productData.aviabilityDays
      ) {
        return [
          ...acc,
          ...item.productData.aviabilityDays.map(date => {
            return {
              value: date,
              label: date,
            };
          }),
        ];
      }
      return acc;
    }, []);
    if (specialDateOptions.length > 0) {
      return specialDateOptions;
    }
    return null;
  }, [items]);
  const dateOptions = useGetDateOptions({
    // onlyNewYearPromotion: isSomePromotionActive,
    specialDateOptions: specialDateOptions,
    customDateOptions: globalSettings.delivery.customDeliveryDays ?? [],
  });

  return (
    <div className={styles.delivery}>
      <CartHeader
        className={styles.header}
        onBackClick={onBackClick}
        title={t('title')}
        onClose={onClose}
      />

      <div className={styles.body}>
        <Formik
          initialValues={{
            name: cartState.customer.name,
            phone: cartState.customer.phone,
            delivery: cartState.delivery.type,
            streetName: cartState.delivery.streetName || '',
            streetId: cartState.delivery.streetId || '',
            house: cartState.delivery.house || '',
            flat: cartState.delivery.flat || '',
            floor: cartState.delivery.floor || '',
            postcode: cartState.delivery.postcode || '',
            date: cartState.delivery.date || dateOptions[0]?.value,
            time: cartState.delivery.time || '',
            payment: cartState.payment.type,
            do_not_call: false,
            do_not_ring_doorbell: false,
            leave_by_the_door: false,
            change: '',
            comment: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            cartDispatch({
              type: 'SET_CUSTOMER',
              payload: {
                name: values.name,
                phone: values.phone,
              },
            });
            if (values.delivery === 'self') {
              cartDispatch({
                type: 'SET_DELIVERY',
                payload: {
                  type: 'self',
                  date: values.date ?? null,
                  time: values.time ?? null,
                },
              });
            } else {
              cartDispatch({
                type: 'SET_DELIVERY',
                payload: {
                  type: values.delivery,
                  // street: values.street,
                  streetName: values.streetName,
                  streetId: values.streetId,
                  flat: values.flat ?? null,
                  address: values.streetName + ' ' + values.house,
                  house: values.house,
                  floor: values.floor ?? null,
                  postcode: values.postcode ?? null,
                  date: values.date ?? null,
                  time: values.time ?? null,
                },
              });
            }
            cartDispatch({
              type: 'SET_PAYMENT',
              payload: {
                type: values.payment,
              },
            });
            cartDispatch({
              type: 'SET_COMMENT',
              payload: {
                key: COMMENT_KEYS.PREPARE_CHANGE,
                value: values.change ?? null,
              },
            });
            cartDispatch({
              type: 'SET_COMMENT',
              payload: {
                key: COMMENT_KEYS.DO_NOT_CALL,
                value: values.do_not_call,
              },
            });
            cartDispatch({
              type: 'SET_COMMENT',
              payload: {
                key: COMMENT_KEYS.DO_NOT_RING_DOORBELL,
                value: values.do_not_ring_doorbell,
              },
            });
            cartDispatch({
              type: 'SET_COMMENT',
              payload: {
                key: COMMENT_KEYS.LEAVE_BY_DOOR,
                value: values.leave_by_the_door,
              },
            });
            cartDispatch({
              type: 'SET_COMMENT',
              payload: {
                key: COMMENT_KEYS.CLIENT_COMMENT,
                value: values.comment,
              },
            });
            onNext();
          }}
        >
          {(props: FormikProps<Values>) => (
            <Form>
              <div className={styles.group}>
                <div className={styles.row}>
                  <Input
                    name="name"
                    type="text"
                    placeholder={t('field.name')}
                  />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder={t('field.phone')}
                  />
                </div>
                <Checkbox name="do_not_call" label={t('checkbox.doNotCall')} />
              </div>
              <div className={styles.group}>
                <ul className={styles.list}>
                  <li>
                    <RadioButton
                      checked={props.values.delivery === 'self'}
                      name="delivery"
                      value="self"
                      label={t('type.self')}
                    />
                  </li>
                  <li>
                    <RadioButton
                      checked={props.values.delivery === 'delivery'}
                      name="delivery"
                      value="delivery"
                      label={t('type.delivery')}
                    />
                  </li>
                </ul>
                <div className={styles.group}>
                  <div className={styles.row}>
                    <Select
                      name="date"
                      label={t('select.date.label')}
                      options={dateOptions}
                    />
                    <TimeSelect />
                  </div>
                </div>
                {props.values.delivery === 'self' ? (
                  <div className={styles.text}>
                    <p>{t('pickUpPoint')}</p>
                    <p>{globalSettings.address}</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.group}>
                      <div className={styles.row}>
                        <AdressSelect
                          inputProps={{
                            name: 'streetName',
                            placeholder: t('field.address'),
                            className: styles.input,
                            type: 'text',
                          }}
                        />
                        {props.values.streetId && (
                          <Input
                            name="house"
                            type="text"
                            placeholder={t('field.house')}
                            maxLength={10}
                          />
                        )}
                      </div>
                      {props.values.streetId && (
                        <>
                          <div className={styles.row}>
                            <Input
                              name="flat"
                              type="text"
                              placeholder={t('field.flat')}
                            />
                            <Input
                              name="floor"
                              type="tel"
                              placeholder={t('field.floor')}
                            />
                          </div>
                          <div className={styles.row}>
                            <Input
                              name="postcode"
                              type="text"
                              placeholder={t('field.postcode')}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className={styles.group}>
                      <ul className={styles.list}>
                        <li>
                          <Checkbox
                            name="do_not_ring_doorbell"
                            label={t('checkbox.doNotRingDoorbell')}
                          />
                        </li>
                        <li>
                          <Checkbox
                            name="leave_by_the_door"
                            label={t('checkbox.leaveByTheDoor')}
                          />
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.group}>
                <div className={styles.groupTitle}>{t('payment.title')}</div>
                <ul className={styles.list}>
                  <li>
                    <RadioButton
                      checked={props.values.payment === 'cash'}
                      name="payment"
                      value="cash"
                      label={t('payment.cash')}
                    />
                  </li>
                  <li>
                    <RadioButton
                      checked={props.values.payment === 'terminal'}
                      name="payment"
                      value="terminal"
                      label={t('payment.card')}
                    />
                  </li>
                  <li>
                    <RadioButton
                      checked={props.values.payment === 'online'}
                      name="payment"
                      value="online"
                      label={t('payment.online')}
                    />
                  </li>
                </ul>
                {props.values.payment === 'cash' && (
                  <Input
                    name="change"
                    type="number"
                    placeholder={t('payment.change')}
                    pattern="[0-9]*"
                  />
                )}
              </div>

              <div className={styles.group}>
                <div className={styles.groupTitle}>{t('field.comment')}</div>
                <Input name="comment" type="text" />
              </div>

              {Object.keys(props.errors).length > 0 && (
                <div className={styles.error}>{t('errorMessage')}</div>
              )}
              {/* {Object.keys(props.errors).map(key => {
                return (
                  <div className={styles.error} key={key}>
                    {props.errors[key]}
                  </div>
                );
              })} */}
              <div className={styles.btnWrap}>
                {props.values.delivery === 'delivery' &&
                  totalPriceWithDiscount - deliveryPrice <=
                    delivery.minOrderPrice && (
                    <div className={styles.minOrder}>
                      {tRoot('cart.footer.minimumOrder')}{' '}
                      {delivery.minOrderPrice} {tRoot('currency.plShort')}
                    </div>
                  )}
                <Button
                  type="submit"
                  size="small"
                  color="tertiary"
                  label={t('buttonMakeOrder')}
                  disabled={
                    props.values.delivery === 'delivery' &&
                    totalPriceWithDiscount - deliveryPrice <=
                      delivery.minOrderPrice
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

function TimeSelect() {
  const { t } = useTranslation('common', {
    keyPrefix: 'cart.delivery',
  });
  const { workingHours } = useGlobalSettings();
  const {
    values: { date: dateValue },
    touched,
    setFieldValue,
  } = useFormikContext<Values>();

  const timeOptions = useMemo(() => {
    if (!workingHours) return [];
    const getDayOfWeek = function (dateValue: string) {
      switch (dateValue) {
        case 'today':
          return dayjs().day();
        case 'tomorrow':
          return dayjs().add(1, 'day').day();
        default:
          return dayjs(dateValue, 'DD.MM').day();
      }
    };
    const dayOfWeek = getDayOfWeek(dateValue);
    const timeOptions: {
      value: string;
      label: string;
    }[] = [];

    // @ts-expect-error
    const dayName = getWeekDayName(dayOfWeek);
    // @ts-ignore
    const dayWorkingHours = (workingHours[dayName] as [string, string]) || null;
    if (!dayWorkingHours) {
      timeOptions.push({
        value: 'noWorkingHours',
        label: t('select.time.option.noWorkingHours'),
      });
      return timeOptions;
    }
    const isToday = dateValue === 'today';
    if (isToday) {
      timeOptions.push({
        value: 'now',
        label: t('select.time.option.asSoonAsPossible'),
      });
    }
    const [startTime, endTime] = dayWorkingHours;
    const timeIntervalStep = 15;
    const currentTime = isToday ? dayjs().add(2, 'hour') : dayjs();
    const openingTime = dayjs(startTime, 'HH:mm').add(1, 'hour');
    const closingTime = dayjs(endTime, 'HH:mm');
    const startFrom =
      openingTime.isBefore(currentTime, 'minutes') && isToday
        ? currentTime
        : openingTime;

    const minutes = startFrom.minute();
    const roundedMinutes =
      Math.ceil(minutes / timeIntervalStep) * timeIntervalStep;
    let time = startFrom.minute(roundedMinutes);

    let i = 0;
    while (time.isBefore(closingTime, 'minutes') && i < 100) {
      const formattedTime = time.format('HH:mm');
      timeOptions.push({ value: formattedTime, label: formattedTime });
      time = time.add(timeIntervalStep, 'minute');
    }
    return timeOptions;
  }, [dateValue, t, workingHours]);

  useEffect(() => {
    if (dateValue && !touched.date) {
      setFieldValue('time', timeOptions[0]?.value);
      touched.time = true;
    }
  }, [timeOptions, setFieldValue, dateValue, touched]);
  return (
    <Select name="time" label={t('select.time.label')} options={timeOptions} />
  );
}

// Get Date options

function useGetDateOptions({
  onlyNewYearPromotion = false,
  customDateOptions = [],
  specialDateOptions = null,
}: {
  onlyNewYearPromotion?: boolean;
  customDateOptions?: string[];
  specialDateOptions?: { value: string; label: string }[] | null;
} = {}) {
  const { t } = useTranslation('common', {
    keyPrefix: 'cart.delivery',
  });
  const { workingHours } = useGlobalSettings();
  if (specialDateOptions) {
    return specialDateOptions;
  }
  if (onlyNewYearPromotion) {
    return [
      {
        value: '14.02',
        label: '14.02',
      },
    ];
  }
  if (!workingHours)
    return [
      {
        value: 'noWorkingDays',
        label: t('select.date.option.noWorkingDays'),
      },
    ];
  const dateOptions: {
    value: string;
    label: string;
  }[] = [];
  let date = dayjs();
  let i = 0;

  while (dateOptions.length < 4 && i < 8) {
    i += 1;
    // @ts-expect-error
    const dayName = getWeekDayName(date.day());
    const isItWorkingDay = Boolean(workingHours[dayName]);
    const isToday = date.isSame(dayjs(), 'day');
    const isTomorrow = date.isSame(dayjs().add(1, 'day'), 'day');
    if (!isItWorkingDay) {
      date = date.add(1, 'day');
      continue;
    }
    const formattedDate = date.format('DD.MM');
    if (isToday) {
      dateOptions.push({
        value: 'today',
        label: t('select.date.option.today'),
      });
    } else if (isTomorrow) {
      dateOptions.push({
        value: formattedDate,
        label: t('select.date.option.tomorrow'),
      });
    } else {
      dateOptions.push({
        value: formattedDate,
        label: formattedDate,
      });
    }
    date = date.add(1, 'day');
  }
  if (dateOptions.length === 0)
    return [
      {
        value: 'noWorkingDays',
        label: t('select.date.option.noWorkingDays'),
      },
    ];
  // 31.12
  // dateOptions.push({
  //   value: '31.12',
  //   label: '31.12',
  // });
  // 14.02
  // if (!dateOptions.some(option => option.value === '14.02')) {
  //   dateOptions.push({
  //     value: '14.02',
  //     label: '14.02',
  //   });
  // }
  // Add custom date options
  if (customDateOptions?.length > 0) {
    customDateOptions.forEach((date: string) => {
      if (!dateOptions.some(dateOption => dateOption.value === date)) {
        dateOptions.push({
          value: date,
          label: date,
        });
      }
    });
  }
  return dateOptions;
}
function getWeekDayName(
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  startFromMonday = false
) {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  if (startFromMonday) {
    days.unshift(days.pop() as string);
  }
  return days[dayOfWeek];
}
