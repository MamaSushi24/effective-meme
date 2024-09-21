import { News } from '@/types/payload-types';

import Container from '@/components/elements/container/container';
import clsx from 'clsx';

import styles from './news-section.module.scss';
import NewCard from '@/components/elements/new-card/new-card';

interface NewsSectionProps {
  news: News[];
}
export default function NewsSection({ news }: NewsSectionProps): JSX.Element {
  return (
    <section className={styles.section}>
      <Container>
        <ul className={styles.list}>
          {news.map((item, index) => (
            <li key={item.id} className={styles.item}>
              {index === 0 ? (
                <NewCard item={item} first />
              ) : (
                <NewCard item={item} />
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
