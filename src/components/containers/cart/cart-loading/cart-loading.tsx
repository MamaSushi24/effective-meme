import Spinner from '@/components/elements/spinner/spinner';
import clsx from 'clsx';

import styles from './cart-loading.module.scss';

interface CartLoadingProps {}
export default function CartLoading({}: CartLoadingProps): JSX.Element {
  return (
    <div className={styles.loading}>
      <Spinner className={styles.spinner} />
    </div>
  );
}
