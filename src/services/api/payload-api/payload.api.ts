import {
  DeliveryPage,
  GlobalSetting,
  HomePage,
  AboutPage,
  News,
  Product,
  Group,
  Collection,
} from '@/types/payload-types';
import { BaseApiProvider } from '../base.api';
import { gql } from 'graphql-request';

const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
};
interface IPayloadAPI {
  getGlobalSettings: () => Promise<GlobalSetting>;
  getHomePage: () => Promise<HomePage>;
  getDeliveryPage: () => Promise<DeliveryPage>;
  getAboutPage: () => Promise<AboutPage>;
  getAllProducts: (depth: number) => Promise<Product[]>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  getProductsByGroup: (groupID: string) => Promise<Product[]>;
  getNews: (arg0?: {
    limit?: number;
    page?: number;
  }) => Promise<PayloadRestAPICollectionResponse<News>>;
  getNewsBySlug: (slug: string) => Promise<News | null>;
  getAllGroups: () => Promise<Group[]>;
}
interface PayloadRestAPICollectionResponse<D> {
  docs: D[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
export class PayloadAPI extends BaseApiProvider implements IPayloadAPI {
  locale = 'pl';
  fallbackLocale = 'pl';
  constructor(
    {
      locale,
      fallbackLocale,
    }: {
      locale?: string;
      fallbackLocale?: string;
    } = {
      locale: 'pl',
      fallbackLocale: 'pl',
    }
  ) {
    super(apiConfig);
    if (locale) this.locale = locale;
    if (fallbackLocale) this.fallbackLocale = fallbackLocale;
    this.fetcher.interceptors.request.use(
      async config => {
        config.params = {
          ...config.params,
          locale: this.locale,
          'fallback-locale': this.fallbackLocale,
        };

        process.env.PAYLOAD_BUILD_SECRET &&
          config.headers.set(
            'x-payload-build-secret',
            process.env.PAYLOAD_BUILD_SECRET
          );
        return config;
      },
      (error: any) => {
        Promise.reject(error);
      }
    );
    return this;
  }
  async getGlobalSettings() {
    const res = await this.fetcher.get<GlobalSetting>(
      '/api/globals/global-settings',
      {
        params: {
          depth: 4,
        },
      }
    );
    return res.data;
  }
  async getHomePage() {
    const res = await this.fetcher.get<HomePage>('/api/globals/home-page', {
      params: {
        depth: 6,
      },
    });
    return res.data;
  }
  async getDeliveryPage() {
    const res = await this.fetcher.get<DeliveryPage>(
      '/api/globals/delivery-page',
      {
        params: {
          depth: 4,
        },
      }
    );
    return res.data;
  }
  async getAboutPage() {
    const res = await this.fetcher.get<AboutPage>('/api/globals/about-page', {
      params: {
        depth: 4,
      },
    });
    return res.data;
  }
  async getAllProducts(depth = 2) {
    const res = await this.fetcher.get<{ docs: Product[] }>('/api/products', {
      params: {
        depth,
        limit: 999999,
      },
    });
    return res.data.docs;
  }
  async getProductsByGroup(groupID: string) {
    const res = await this.fetcher.get<{ docs: Product[] }>('/api/products', {
      params: {
        depth: 4,
        limit: 999999,
        'where[parentGroup][equals]': groupID,
      },
    });
    return res.data.docs;
  }
  async getProductBySlug(slug: string) {
    const res = await this.fetcher.get<
      PayloadRestAPICollectionResponse<Product>
    >(`/api/products?where[slug][equals]=${slug}`, {
      params: {
        depth: 4,
      },
    });
    if (res.data.docs.length !== 1) return null;
    return res.data.docs[0];
  }
  async getNews(
    arg0 = {
      limit: 10,
      page: 1,
    }
  ) {
    const { limit, page } = arg0;
    const res = await this.fetcher.get<PayloadRestAPICollectionResponse<News>>(
      '/api/news',
      {
        params: {
          limit,
          page,
        },
      }
    );
    return res.data;
  }
  async getNewsBySlug(slug) {
    const res = await this.fetcher.get<PayloadRestAPICollectionResponse<News>>(
      `/api/news?where[slug][equals]=${slug}`
    );
    if (res.data.docs.length !== 1) return null;
    return res.data.docs[0];
  }
  async getAllGroups() {
    const res = await this.fetcher.get<PayloadRestAPICollectionResponse<Group>>(
      '/api/groups',
      {
        params: {
          limit: 9999999,
          depth: 1,
        },
      }
    );
    return res.data.docs;
  }
  async getCollectionBySlug(
    slug: string,
    locale: string
  ): Promise<Collection | undefined> {
    const res = await this.fetcher.get(
      `/api/collections?where[slug][equals]=${slug}`,
      {
        params: {
          locale,
          'fallback-locale': this.fallbackLocale,
          depth: 4,
        },
      }
    );
    return res.data.docs[0];
  }
}

const HOME_PAGE_QUERY = gql``;
