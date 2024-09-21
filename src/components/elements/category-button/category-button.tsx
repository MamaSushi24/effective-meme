import clsx from 'clsx';

import styles from './category-button.module.scss';

interface CategoryButtonProps {
  active: boolean;
  name: string;
  onClick?: () => void;
}
export default function CategoryButton({
  active,
  name,
  onClick,
}: CategoryButtonProps): JSX.Element {
  return (
    <button
      className={clsx(styles.button, { [styles.active]: active })}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
