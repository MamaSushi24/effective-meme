import { Payload } from 'payload';
import IProduct from '../Product/IProduct';
import IRepository from './IRepository';
import getPayloadClient from '../../../payload/payloadClient';
import { DiscountStrategy } from '@/types/payload-types';
import NodeCache from 'node-cache';
import hash from 'hash-it';
export default class Repository implements IRepository {
  private static _client: Payload;
  private CacheProvider: NodeCache | null = null;
  private static instance: Repository | null = null;

  public static async getInstance() {
    if (!Repository.instance) {
      this._client = await getPayloadClient();
      Repository.instance = new Repository();
    }
    return Repository.instance;
  }
  private constructor() {
    this.CacheProvider = new NodeCache({
      stdTTL: 60 * 15, // 15 minutes
    });
  }

  async getProductsByIds(
    productIds: string[],
    locale = 'pl'
  ): Promise<IProduct[] | never> {
    const params = {
      productIds,
      locale,
    };
    const KEY = `getProductsByIds_${hash(params)}`;
    const cached = this.CacheProvider?.get<IProduct[]>(KEY);
    if (cached) {
      return cached;
    }
    try {
      const products = await Repository._client
        .find({
          collection: 'products',
          where: {
            id: {
              in: productIds.join(','),
            },
          },
          locale,
        })
        .then(res => res.docs);
      if (products?.length !== productIds.length) {
        const notFoundProducts = productIds.filter(
          productId => !products.find(product => product.id === productId)
        );
        throw new Error(
          `Products with ids ${notFoundProducts.join(', ')} not found`
        );
      }
      const productsData: IProduct[] = products.map(product => {
        const featuredImage =
          typeof product.cardImage === 'object'
            ? product.cardImage?.url
            : product.cardImage;
        const getParentGroupID = (): string | null | undefined => {
          if (!product.parentGroup) return null;
          if (typeof product.parentGroup === 'string')
            return product.parentGroup;
          if (typeof product.parentGroup === 'object')
            return product.parentGroup?.id;
        };
        return {
          id: product.id,
          name: product.name,
          price: Number(product.price) * 100,
          description: product.quantity ?? '',
          featuredImage: featuredImage ?? '',
          url: `/product/${product.slug}`,
          slug: product.slug,
          parentGroup: getParentGroupID(),
          nameSyrve: product.nameSyrve ?? '',
          availableOnlyForSpecifiedDays:
            product.availableOnlyForSpecifiedDays ?? false,
          aviabilityDays: product.aviabilityDays ?? [],
        };
      });
      this.CacheProvider?.set(KEY, productsData);
      return productsData;
    } catch (error) {
      console.log(`Error while getting products by ids [${productIds}]`, error);
      throw error;
    }
  }
  async validateDiscountCode(discountCode: string): Promise<boolean> {
    return Promise.resolve(true);
  }
  async incrementDiscountUsed(discountID: string): Promise<number> {
    return Promise.resolve(10);
  }
  async getDiscountStrategies({
    locale,
  }: {
    locale: 'pl' | 'ru' | 'en' | 'uk';
  }): Promise<DiscountStrategy[]> {
    const KEY = `getDiscountStrategies_${locale}`;
    const cached = this.CacheProvider?.get<DiscountStrategy[]>(KEY);
    if (cached) {
      return cached;
    }
    const res = await Repository._client
      .find({
        collection: 'discount-strategies',
        limit: 100,
        locale,
      })
      .then(res => res.docs.filter(doc => doc.active));

    const discountStrategies: DiscountStrategy[] = res.map(doc => {
      // If combinations is array of objects - convert it to array of strings with ids
      const combinations = doc?.combinations?.map(combination => {
        if (typeof combination === 'string') return combination;
        return combination?.id;
      });
      return {
        ...doc,
        combinations: combinations ?? [],
      };
    });
    this.CacheProvider?.set(KEY, discountStrategies, 60);
    return discountStrategies;
  }
  async getDiscountStrategyUsedByPhone(
    phone: string,
    discountID: string
  ): Promise<number> {
    const query = Repository?._client.db?.collections['orders']?.countDocuments(
      {
        'customer.phone': phone,
        discountStrategiesApplied: {
          $elemMatch: {
            $eq: discountID,
          },
        },
      }
    );
    const res = await query.exec();

    return res ?? 0;
  }
}
