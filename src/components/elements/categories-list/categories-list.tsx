import clsx from 'clsx';
import CategoryButton from '../category-button/category-button';
import Container from '../container/container';

import styles from './categories-list.module.scss';
import { Collection, Group, Product } from '@/types/payload-types';
import { useCallback, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface CategoriesListProps {
  data: Collection[];
  specialCategory: string;
  products: Product[];
  setCategoryID: (id: string | null) => void;
  setSpecialCategory: (specialCategory: string) => void;
}

export default function CategoriesList({
  data,
  specialCategory,
  products,
  setSpecialCategory,
  setCategoryID,
}: CategoriesListProps): JSX.Element {
  const { t } = useTranslation('common');

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const hasProductsForField = useCallback(
    (field: string) => {
      return products.some(product => product[field] === true);
    },
    [products]
  );

  const handleCategoryClick = (id: string | null, categoryType?: string) => {
    if (categoryType) {
      setActiveCategory(null);
      setCategoryID(null);
      setSpecialCategory(categoryType);
    } else {
      setActiveCategory(id);
      setCategoryID(id);
      setSpecialCategory('');
    }
  };

  const resetCategory = () => {
    setActiveCategory(null);
    setCategoryID(null);
    setSpecialCategory('');
  };

  return (
    <section className={styles.section}>
      <Container>
        <ul className={styles.list}>
          <li key="all" className={styles.item}>
            <CategoryButton
              name="Wszystko"
              onClick={resetCategory}
              active={!activeCategory && !specialCategory}
            />
          </li>
          {data.map(category => (
            <li key={category.id} className={styles.item}>
              <CategoryButton
                name={category.name}
                onClick={() => handleCategoryClick(category.id)}
                active={category.id === activeCategory}
              />
            </li>
          ))}
          {hasProductsForField('vegan') && (
            <li key="vegan" className={styles.item}>
              <CategoryButton
                name={t('category.vegan')}
                onClick={() => handleCategoryClick(null, 'vegan')}
                active={specialCategory === 'vegan'}
              />
            </li>
          )}
          {hasProductsForField('spicy') && (
            <li key="spicy" className={styles.item}>
              <CategoryButton
                name={t('category.spicy')}
                onClick={() => handleCategoryClick(null, 'spicy')}
                active={specialCategory === 'spicy'}
              />
            </li>
          )}
        </ul>
      </Container>
    </section>
  );
}
