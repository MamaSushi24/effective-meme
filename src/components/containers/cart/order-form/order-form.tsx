import clsx from 'clsx';
import { Field, useFormikContext } from 'formik';

import styles from './order-form.module.scss';

interface OrderFormProps {}
export default function OrderForm({}: OrderFormProps): JSX.Element {
  const formik = useFormikContext<any>();

  return (
    <div>
      <div className={styles.group}>
        <div className={styles.row}>
          <div className={styles.field}>
            <Field
              className={`${styles.input} ${
                formik.errors.name ? styles.error : ''
              }`}
              type="text"
              placeholder="Imię*"
              id="name"
              name="name"
            />
          </div>
          <div className={styles.field}>
            <Field
              className={`${styles.input} ${
                formik.errors.phone ? styles.error : ''
              }`}
              type="text"
              placeholder="Numer telefonu*"
              id="phone"
              name="phone"
            />
          </div>
        </div>
      </div>
      <div>
        <button type="submit">Отправить</button>
      </div>
    </div>
  );
}
