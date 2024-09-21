import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import styles from './category-button.module.scss';

interface CategoryButtonProps {
  name: string;
  link: string;
  icon: string;
}
export default function CategoryButton({
  name,
  link,
  icon,
}: CategoryButtonProps): JSX.Element {
  return (
    <>
      <Link href={link} className={styles.button}>
        <span className={styles.icon}>
          <Image src={icon} alt="" fill unoptimized />
        </span>
        <span className={styles.title}>{name}</span>
      </Link>
    </>
  );
}
