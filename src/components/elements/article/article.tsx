import { News } from '@/types/payload-types';
import clsx from 'clsx';
import Image from 'next/image';
import Container from '../container/container';
import styles from './article.module.scss';
import RichText from '../RichText';

interface ArticleProps {
  newData: News;
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}/${formattedMonth}/${year}`;
};

export default function Article({ newData }: ArticleProps): JSX.Element {
  const originalDate = newData.date;
  const formattedDate = formatDate(originalDate);

  return (
    <section className={styles.section}>
      <Container>
        <picture className={styles.img}>
          <source
            // @ts-ignore
            srcSet={newData.coverImgMobile.url}
            media="(max-width: 744px)"
          />
          <Image
            // @ts-ignore
            src={newData.coverImgDesktop.url}
            alt={newData.title}
            fill
          />
        </picture>
        <div className={styles.inner}>
          <h1 className={styles.title}>{newData.title}</h1>
          <div className={styles.date}>{formattedDate}</div>
          <div className={styles.content}>
            <RichText content={newData.content} />
            {/* {serializeField(newData.content)} */}
          </div>
        </div>
      </Container>
    </section>
  );
}
