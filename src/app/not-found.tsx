import Container from '@/components/elements/container/container';
import styles from './not-found.module.scss';
import OopsTitle from '@/assets/oops.svg';
import Link from 'next/link';
import Button from '@/components/elements/button/button';
import { Metadata } from 'next/types';
export default function NotFound() {
  return (
    <section className={styles['not-found']}>
      <Container>
        <OopsTitle className={styles.img} />
        <p className={styles.descr}>
          Somethind went wrong. Sorry, we cant find the page you’re looking for
        </p>
        <Button
          href="/"
          className={styles.btn}
          label={'Back to the Home page'}
        />
      </Container>
    </section>
  );
}
export const metadata: Metadata = {
  title: 'Page not found',
};
