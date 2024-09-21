import { useField } from 'formik';

import clsx from 'clsx';

import styles from './checkbox.module.scss';
import CheckIcon from './assets/check-icon.svg';

export default function Checkbox({ ...props }): JSX.Element {
  const [field, meta, helpers] = useField(props.name);
  return (
    <label
      className={clsx(styles.wrap, meta.error && meta.touched && styles.error)}
    >
      <input className={styles.input} type="checkbox" {...field} {...props} />
      <span className={styles.checkmark}>
        <CheckIcon />
      </span>
      <span className={styles.label}>{props.label}</span>
    </label>
  );
}
