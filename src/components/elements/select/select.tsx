import clsx from 'clsx';
import { useField } from 'formik';

import styles from './select.module.scss';

export default function Select({ ...props }): JSX.Element {
  const [field, meta] = useField(props.name);
  return (
    <div className={styles.wrap}>
      {props.label && <label className={styles.label}>{props.label}</label>}
      <select
        id={props.name}
        {...field}
        className={clsx(
          styles.select,
          meta.error && meta.touched && styles.error,
        )}
        value={field.value}
        onChange={e => {
          if (props.onChange) {
            props.onChange(e);
          }
          field.onChange(e);
        }}
      >
        {props.options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
