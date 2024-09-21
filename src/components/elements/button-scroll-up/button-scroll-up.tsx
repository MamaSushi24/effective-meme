import clsx from 'clsx';

import styles from './button-scroll-up.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import Icon from './assets/icon.svg';
import { useRouter } from 'next/router';
import throttle from 'lodash/throttle';
interface ButtonScrollUpProps {}
export default function ButtonScrollUp({}: ButtonScrollUpProps): JSX.Element {
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();


  useIsomorphicLayoutEffect(() => {
  const handleScroll = () => {
    const start = window.innerHeight * 2;
    if (window.scrollY >= start) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  };

  // Применяем троттлинг с помощью Lodash. Ограничиваем вызовы до 1 раза в 100 мс.
  const throttledScroll = throttle(handleScroll, 100);

  window.addEventListener('scroll', throttledScroll);

  // Вызываем handleScroll при монтировании для инициализации состояния
    handleScroll();
    
    const onRouteChangeComplete = () => {
    // Прямой вызов handleScroll, так как он не требуется часто при смене маршрута
    handleScroll();
  };

  router.events.on('routeChangeComplete', onRouteChangeComplete);
  return () => {
    window.removeEventListener('scroll', throttledScroll);
    router.events.off('routeChangeComplete', onRouteChangeComplete);
    throttledScroll.cancel(); // Очищаем троттлинг, если Lodash поддерживает
  };
  }, []);
  
  const handleClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
  return (
    <button
      className={clsx(styles.button, {
        [styles.show]: isShow,
        [styles.hide]: !isShow,
      })}
      onClick={handleClick}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
