import clsx from 'clsx';
import { useField } from 'formik';

import styles from './input.module.scss';

export default function Input({ ...props }): JSX.Element {
  const [field, meta, helpers] = useField(props.name);
  const onChangeImpl = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(e);
    field.onChange(e);
  };
  return (
    <div className={styles.inputWrap}>
      {meta.error && meta.touched && <div className={styles.marker}>!</div>}
      <input
        {...field}
        {...props}
        onChange={onChangeImpl}
        className={clsx(
          styles.input,
          meta.error && meta.touched && styles.error
        )}
      />
    </div>
  );
}
