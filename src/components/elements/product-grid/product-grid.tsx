import ProductCard from '../product-card/product-card';

import styles from './product-grid.module.scss';
import { Product } from '@/types/payload-types';

interface ProductGridProps {
  products: Product[];
  analytics?: {
    list_name: string;
    list_id: string;
  };
}
export default function ProductGrid({
  products,
  analytics,
}: ProductGridProps): JSX.Element {
  return (
    <>
      {products && (
        <ul className={styles.list}>
          {products.map((product, idx) => {
            return (
              <li key={idx} className={styles.item}>
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
      )}
    </>
  );
}
