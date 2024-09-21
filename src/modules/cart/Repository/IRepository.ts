import { DiscountStrategy } from '@/types/payload-types';
import IProduct from '../Product/IProduct';

export default interface IRepository {
  getProductsByIds(
    productIds: string[],
    locale: 'en' | 'pl' | 'ru' | 'uk'
  ): Promise<IProduct[]>;
  validateDiscountCode(discountCode: string): Promise<boolean>;
  incrementDiscountUsed(discountID: string): Promise<number>;
  getDiscountStrategies(params: {
    locale: 'pl' | 'ru' | 'en' | 'uk';
  }): Promise<DiscountStrategy[]>;
  getDiscountStrategyUsedByPhone(
    phone: string,
    discountID: string
  ): Promise<number>;
}
