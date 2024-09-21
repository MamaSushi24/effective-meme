import clsx from 'clsx';

import styles from './work-schedule.module.scss';
import { useTranslation } from 'next-i18next';

export interface WorkScheduleProps {
  schedule: {
    [key in Day]: DaySchedule;
  };
}

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
type DaySchedule = [string, string] | null;

const translationKeys: string[] = [
  'mondayShort',
  'tuesdayShort',
  'wednesdayShort',
  'thursdayShort',
  'fridayShort',
  'saturdayShort',
  'sundayShort',
  'dayOff',
];
type ReducedLine = {
  dayStart: string;
  dayEnd: string | null;
  time: string;
};
export default function WorkSchedule({
  schedule,
}: WorkScheduleProps): JSX.Element {
  const { t } = useTranslation('common');
  const values = Object.values(schedule);
  const lines: {
    day: string;
    time: string;
  }[] = values.map((daySchedule, index) => ({
    day: t(translationKeys[index]),
    time: daySchedule ? `${daySchedule[0]}-${daySchedule[1]}` : t('dayOff'),
  }));
  const reducedLines: ReducedLine[] = lines.reduce((acc, line) => {
    const currentLine = line;
    const lastSavedLine = acc[acc.length - 1];
    const newLine = {
      dayStart: currentLine.day,
      dayEnd: null,
      time: currentLine.time,
    };
    if (!lastSavedLine) {
      return [...acc, newLine];
    }
    if (currentLine.time === lastSavedLine.time) {
      lastSavedLine.dayEnd = currentLine.day;
      return acc;
    }
    return [...acc, newLine];
  }, [] as ReducedLine[]);

  const textLines: String[] = reducedLines.map(line => {
    const { dayStart, dayEnd, time } = line;
    if (dayEnd) {
      return `${dayStart}-${dayEnd}: ${time}`;
    }
    return `${dayStart}: ${time}`;
  });
  return (
    <>
      {textLines.map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </>
  );
}
