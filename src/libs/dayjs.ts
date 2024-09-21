import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBeetween from 'dayjs/plugin/isBetween';
import updateLocale from 'dayjs/plugin/updateLocale';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(utc);
dayjs.extend(isBeetween);
dayjs.extend(timezone);
dayjs.extend(isoWeek);
dayjs.extend(updateLocale);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault('Europe/Warsaw');
dayjs.extend(isToday);
dayjs.updateLocale('en', {
  weekdays: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ],
});
export default dayjs;
