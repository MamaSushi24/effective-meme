import clsx from 'clsx';

import styles from './working-hours.module.scss';

interface WorkingHoursProps {}
export default function WorkingHours({}: WorkingHoursProps): JSX.Element {
  return (
    <>
      <div className={styles.dropdown}>
        <div className={styles.dropdownItem}>Godziny pracy</div>
        <ul className={styles.dropDownList}>
          <li>Pn-Ct 12:00-22:00</li>
          <li>Pt-Nd 12:00-23:00</li>
        </ul>
      </div>
    </>
  );
}
