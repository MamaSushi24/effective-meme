import clsx from 'clsx';

import styles from './socials.module.scss';
import InstaIcon from './assets/insta-icon.svg';
import FacebookIcon from './assets/facebook-icon.svg';
import Link from 'next/link';

interface SocialsProps {
  instagram?: string | null;
  facebook?: string | null;
}

export default function Socials({
  instagram,
  facebook,
}: SocialsProps): JSX.Element {
  const socialsData = [
    {
      icon: <InstaIcon />,
      alt: 'Instagram',
      link: instagram,
    },
    {
      icon: <FacebookIcon />,
      alt: 'Facebook',
      link: facebook,
    },
  ];
  return (
    <>
      <ul className={styles.socials}>
        {socialsData.map((item, idx) => {
          if (!item.link) return null;
          return (
            <li key={idx}>
              <Link
                className={styles.link}
                href={item.link}
                target="_blank"
                aria-label={item.alt}
              >
                {item.icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
