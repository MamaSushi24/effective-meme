import clsx from 'clsx';
import Image from 'next/image';
import gsap from 'gsap';
import styles from './about-section.module.scss';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import ScrollTrigger from 'gsap/ScrollTrigger';
interface AboutSectionProps {}
gsap.registerPlugin(ScrollTrigger);
export default function AboutSection({}: AboutSectionProps): JSX.Element {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(self => {
      if (!self.selector) self.selector = gsap.utils.selector(rootRef.current);
      // Scene 1
      {
        if (!rootRef.current) return;
        const wrapRef = rootRef.current;
        const scenes = gsap.utils.toArray<HTMLElement>(`.${styles.scene}`);
        const allSlides =
          gsap.utils.toArray<HTMLElement>(`[data-anim="slide"]`);
        const getScrollWidth = (els: HTMLElement[]) =>
          els.reduce((acc, slide) => {
            return acc + slide.scrollWidth;
          }, 0);

        // Chinese text
        const els = gsap.utils.toArray<HTMLElement>(
          '[data-anim="chinese-text"]',
          scenes[0]
        );
        const chineseTextFirstTween = gsap.fromTo(
          [els[0], els[1]],
          { opacity: 0, xPercent: -25 },
          {
            opacity: 1,
            duration: 0.75,
            xPercent: 0,
            delay: 0.5,
            paused: true,
          }
        );
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            anticipatePin: 1,
            end: () => `+=` + getScrollWidth(allSlides) * 1.2,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            chineseTextFirstTween.play();
          },
          invalidateOnRefresh: true,
          defaults: {
            duration: 0.5,
          },
        });

        const scene1Slides = gsap.utils.toArray<HTMLElement>(
          `[data-anim="scene-1"] [data-anim="slide"]`
        );

        tl.to('[data-anim="scene-1"]', {
          x: () => -getScrollWidth(scene1Slides) + wrapRef.clientWidth,
          duration: (_, target) => {
            const distance = target.scrollWidth - wrapRef.clientWidth;
            const height = target.scrollHeight;
            const duration = (distance / height) * 0.5;
            return duration;
          },
        })
          .fromTo(
            `[data-anim="scene-2"] [data-anim="slide"]:nth-child(1)`,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
            }
          )
          .fromTo(
            `[data-anim="scene-2"] [data-anim="slide"]:nth-child(2)`,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
            }
          )
          .fromTo(
            `[data-anim="scene-3"]`,
            {
              yPercent: 100,
            },
            {
              yPercent: 0,
            }
          );

        const scene3slides = gsap.utils.toArray<HTMLElement>(
          `[data-anim="scene-3"] [data-anim="slide"]`
        );
        tl.to('[data-anim="scene-3"]', {
          x: () => -getScrollWidth(scene3slides) + wrapRef.clientWidth,
          duration: (_, target) => {
            const distance = target.scrollWidth - wrapRef.clientWidth;
            const height = target.scrollHeight;
            const duration = (distance / height) * 0.5;
            return duration;
          },
        });

        tl?.scrollTrigger?.update();
      }
    }, rootRef.current);
    return () => ctx.revert();
  }, []);
  return (
    <section className={styles.section} ref={rootRef}>
      <div className={styles.wrap}>
        <div
          className={clsx(styles['scene-1'], styles.scene)}
          data-anim="scene-1"
        >
          <div className={styles.block} data-anim="slide">
            <h1 className={styles.title}>
              <span data-anim="chinese-text">ワルシャワのリトル・ジャパン</span>
              <span data-anim="chinese-text">日本からのプレミアム直送</span>
              Mamasushi
              <span data-anim="chinese-text">
                本物の日本人ママのロールケーキ
              </span>
            </h1>
          </div>
          <div className={styles.block} data-anim="slide">
            <Image src="/img/about-img-1.jpg" alt="" fill />
          </div>
        </div>
      </div>
      <div className={styles.wrap}>
        <div
          className={clsx(styles['scene-2'], styles.scene)}
          data-anim="scene-2"
        >
          <div className={styles.block} data-anim="slide">
            <Image src="/img/about-img-2.jpg" alt="" fill />
          </div>
          <div className={styles.block} data-anim="slide">
            <div className={styles.content}>
              <p className={styles.accentText}>
                本物の日本人ママのロールケーキ
              </p>
              <p className={styles.text}>
                Cześć! Tu Mama sushi! Reprezentujemy prawdziwą japońską kuchnię.
                Wieloletnie doświadczenie naszych mistrzów i miłość do tej
                kultury stworzyły naszą instytucję.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <div
          className={clsx(styles['scene-3'], styles.scene)}
          data-anim="scene-3"
        >
          <div className={styles.block} data-anim="slide">
            <Image src="/img/about-img-3.jpg" alt="" fill />
          </div>
          <div className={styles.block} data-anim="slide">
            <div className={clsx(styles.content, styles.alignRight)}>
              <p className={clsx(styles.accentText, styles.big)}>
                本物の日本人ママのロールケーキ
              </p>
              <p className={styles.text}>
                To nie przypadek, że Japończycy zajmują pierwsze miejsce na
                świecie pod względem średniej długości życia. Ich codzienne
                jedzenie ma niską zawartość cholesterolu, jest przygotowywane z
                najświeższych produktów, poddawanych minimalnej obróbce
                cieplnej, co pozwala im zachować dużą liczbę składników
                odżywczych w żywności.
              </p>
            </div>
          </div>
          <div className={styles.block} data-anim="slide">
            <Image src="/img/about-img-4.jpg" alt="" fill />
          </div>
          <div className={styles.block} data-anim="slide">
            <Image src="/img/about-img-5.jpg" alt="" fill />
            <div className={styles.content}>
              <p className={styles.text}>
                My, wraz z naszym zespołem Mama Sushi, jesteśmy gotowi pokazać
                Państwu najwyższe standardy jakości w przygotowywaniu i
                dostarczaniu dań naszej restauracji i czekamy na Państwa!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
