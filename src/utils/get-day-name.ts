export default function getDayName(dayOfWeek: number, startFromMonday = false) {
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
