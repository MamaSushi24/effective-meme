import clsx from 'clsx';
import styles from './lang-switcher.module.scss';
import { useState, useRef } from 'react';
import { i18n, useTranslation } from 'next-i18next';
import Link from 'next/link';
import ArrowDown from './assets/arrow-down.svg';
import { useOnClickOutside } from 'usehooks-ts';
import { LOCALES } from '@/consts/locales';
import { usePathname } from 'next/navigation';

const LANGUAGES = LOCALES;

interface LangSwitcherProps {}

export default function LangSwitcher({}: LangSwitcherProps): JSX.Element {
  const {
    i18n: { language: currentLanguage },
  } = useTranslation('common');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleLanguageClick = (lang: string) => {
    setIsOpen(false);
    window.sessionStorage.clear();
    window.dispatchEvent(new Event('session-storage'));
  };

  return (
    <div className={clsx(styles.switcher, { [styles.active]: isOpen })}>
      <div className={styles.current} onClick={() => setIsOpen(!isOpen)}>
        {currentLanguage}
        <ArrowDown />
      </div>
      <ul className={styles.dropdown} ref={dropdownRef}>
        {LANGUAGES.map((lang, idx) => {
          if (lang !== currentLanguage) {
            return (
              <li key={idx}>
                <Link
                  href={pathname || '/'}
                  locale={lang}
                  prefetch={false}
                  onClick={() => handleLanguageClick(lang)}
                >
                  {lang}
                </Link>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}
