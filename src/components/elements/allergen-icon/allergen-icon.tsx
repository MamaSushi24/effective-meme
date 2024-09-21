import clsx from 'clsx';
import Image from 'next/image';

import styles from './allergen-icon.module.scss';

export default function AllergenIcon({ props }): JSX.Element {
  return (
    <div className={styles.allergen}>
      <Image
        src={typeof props.icon === 'string' ? props.icon : props.icon.url}
        alt={props.name}
        fill
        sizes="100vw"
      />
    </div>
  );
}
