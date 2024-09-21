import clsx from 'clsx';
import { useField } from 'formik';

import styles from './radio-button.module.scss';

export default function RadioButton({ ...props }): JSX.Element {
  const [field, meta, helpers] = useField(props.name);

  return (
    <label className={styles.wrap}>
      <input className={styles.input} type="radio" {...field} {...props} />
      <span className={styles.checkmark} />
      <span className={styles.label}>{props.label}</span>
    </label>
  );
}
