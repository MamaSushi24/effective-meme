import Container from '@/components/elements/container/container';
import ProductCard from '@/components/elements/product-card/product-card';
import { Product } from '@/types/payload-types';

import styles from './product-grid-section.module.scss';

interface ProductGridSectionProps {
  products: Product[];
  analytics?: {
    list_name: string;
    list_id: string;
  };
}
export default function ProductGridSection({
  products,
  analytics,
}: ProductGridSectionProps): JSX.Element {
  return (
    <>
      <section className={styles.section}>
        <Container>
          <ul className={styles.list}>
            {products.map((product, idx) => {
              return (
                <li key={product.id} className={styles.item}>
                  <ProductCard
                    data={product}
                    analytics={{
                      list_name: analytics?.list_name,
                      list_id: analytics?.list_id,
                      index: idx,
                      quantity: 1,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
