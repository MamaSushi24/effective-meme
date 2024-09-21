import { TimePicker, TimeRangePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useField } from 'payload/components/forms';
import { useLocale } from 'payload/components/utilities';
import { capitalize } from 'lodash';
import { TTimeRangeFieldData } from './types';
import React from 'react';
dayjs.extend(customParseFormat);
declare type EventValue<DateType> = DateType | null;
interface Props {
  label: string | { [key: string]: string };
  path: string;
  rangePickerProps?: TimeRangePickerProps;
}
export default function TimeRangePickerField({
  label,
  path,
  rangePickerProps,
}: Props): JSX.Element {
  const { code: locale } = useLocale();
  const { value, setValue } = useField<TTimeRangeFieldData>({
    path,
  });
  const labelLocalized =
    typeof label === 'object'
      ? label[locale]
      : typeof label === 'string'
        ? label
        : 'Label not found';
  const labelFormatted = capitalize(labelLocalized);
  const startTime: EventValue<Dayjs> = value?.[0]
    ? dayjs(value?.[0], 'HH:mm')
    : null;
  const endTime: EventValue<Dayjs> = value?.[1]
    ? dayjs(value?.[1], 'HH:mm')
    : null;

  const timePickerValue: [EventValue<Dayjs>, EventValue<Dayjs>] = [
    startTime,
    endTime,
  ];

  return (
    <div
      style={{
        marginBottom: '1.92rem',
      }}
    >
      <h5 className={'field-label'}>{labelFormatted}</h5>
      <div>
        <TimePicker.RangePicker
          format={'HH:mm'}
          size="small"
          changeOnBlur
          minuteStep={5}
          value={timePickerValue}
          onChange={(_, strings) => {
            const [startTime, endTime] = strings;
            if (startTime && endTime) setValue(strings);
            else setValue([null, null]);
          }}
          {...rangePickerProps}
        />
      </div>
    </div>
  );
}
