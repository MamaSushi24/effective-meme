import Image from 'next/image';
import { SwiperRef } from 'swiper/react';
import 'swiper/css';

import Container from '@/components/elements/container/container';
import clsx from 'clsx';

import styles from './news-slider.module.scss';
import Link from 'next/link';
import { News } from '@/types/payload-types';
import { useEffect, useRef } from 'react';

interface NewsSliderProps {
  data: News[];
}
export default function NewsSlider({ data }: NewsSliderProps): JSX.Element {
  const swiperContainerRef = useRef(null);
  const swiperInstance = useRef<SwiperRef['swiper']>();

  useEffect(() => {
    const initSwiper = async () => {
      if (!swiperContainerRef.current) return;
      const Swiper = (await import('swiper')).default;
      const { Pagination, Autoplay } = await import('swiper/modules');

      swiperInstance.current = new Swiper(swiperContainerRef.current, {
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        loop: true,
        autoplay: {
          delay: 10000,
        },
        modules: [Pagination, Autoplay],
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          initSwiper();
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (swiperContainerRef.current)
      observer.observe(swiperContainerRef.current);

    return () => {
      observer.disconnect();
      swiperInstance.current?.destroy();
    };
  }, []);
  return (
    <section className={clsx(styles.section, 'section')}>
      <Container className={styles.container}>
        {/* <Swiper
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={true}
            autoplay={{ delay: 10000 }}
            modules={[Pagination, Autoplay]}
          >
            {data.map(slide => (
              <SwiperSlide key={slide.id}>
                <Link href={`/news/${slide.slug}`} className={styles.link}>
                  <picture className={styles.img}>
                    <source
                      // @ts-ignore
                      srcSet={slide.coverImgMobile.url}
                      media="(max-width: 744px)"
                    />
                    <Image
                      // @ts-ignore
                      src={slide.coverImgDesktop.url}
                      alt={slide.title}
                      fill
                    />
                  </picture>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper> */}

        <div className="swiper" ref={swiperContainerRef}>
          <div className="swiper-wrapper">
            {data.map(slide => (
              <div className="swiper-slide" key={slide.id}>
                <Link
                  href={`/news/${slide.slug}`}
                  className={styles.link}
                  prefetch={false}
                >
                  <picture className={styles.img}>
                    <source
                      // @ts-ignore
                      srcSet={slide.coverImgMobile.url}
                      media="(max-width: 744px)"
                    />
                    <Image
                      // @ts-ignore
                      src={slide.coverImgDesktop.url}
                      alt={slide.title}
                      fill
                    />
                  </picture>
                </Link>
              </div>
            ))}
          </div>
          <div className="swiper-pagination">
            {data.map(slide => (
              <span className="swiper-pagination-bullet" key={slide.id}></span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
