import ProductCover from '@/components/elements/product-cover/product-cover';
import ProductInfo from '@/components/elements/product-info/product-info';
import ProductSlider from '@/components/elements/product-slider/product-slider';
import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
// import getPayloadClient from '@/payload/payloadClient';
import { createInstance } from 'i18next';
import {
  GlobalSetting,
  Group,
  Product,
  ProductsHeroesImage,
} from '@/types/payload-types';
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from 'next/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import { use, useEffect, useState } from 'react';
import request, { gql } from 'graphql-request';
import { useRouter } from 'next/router';
import mergeJsonLD from '@/utils/mergeJsonLD';
import RichText from '@/components/elements/RichText';
import Container from '@/components/elements/container/container';
const PRODUCT_QUERY = gql`
  query ProductQuery(
    $slug: String!
    $fallbackLocale: FallbackLocaleInputType = pl
    $locale: LocaleInputType
  ) {
    Products(
      where: { slug: { equals: $slug }, hidden: { equals: false } }
      limit: 1
      locale: $locale
      fallbackLocale: $fallbackLocale
    ) {
      docs {
        id
        slug
        price
        description
        name
        nameSyrve
        parentGroup {
          id
          nameSyrve
        }
        allergens {
          id
          icon {
            url
          }
          name
        }
        aviabilityHours
        cardImage {
          url
        }
        quantity
        spicy
        vegan
        hidden
        heroImage {
          url
          sizes {
            desktop {
              url
            }
            tablet {
              url
            }
            mobile {
              url
            }
          }
        }
        composition
        meta {
          description
          image {
            url
          }
          title
        }
      }
    }
  }
`;
const ALL_PRODUCTS_QUERY = gql`
  query AllProductsQuery(
    $fallbackLocale: FallbackLocaleInputType = pl
    $locale: LocaleInputType
  ) {
    Products(
      limit: 999999
      locale: $locale
      fallbackLocale: $fallbackLocale
      where: { hidden: { equals: false } }
    ) {
      docs {
        id
        slug
        parentGroup {
          id
          nameSyrve
        }
        price
        name
        spicy
        vegan
        cardImage {
          url
        }
      }
    }
  }
`;
interface Props {
  data: Product;
  globalSettings: GlobalSetting;
  drinksData: Product[];
  allProducts: Product[];
}
export default function Page({
  data,
  globalSettings, // drinksData,
  // allProducts,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const ogImage =
    data.meta?.image ||
    (data.heroImage as ProductsHeroesImage)?.sizes?.desktop?.url ||
    null;
  const [reccomendedProducts, setReccomendedProducts] = useState<Product[]>([]);
  const [allProductsData, setAllProductsData] = useState<Product[]>([]);
  const [drinksData, setDrinksData] = useState<Product[]>([]);
  // get all products
  useEffect(() => {
    (async () => {
      const newProducts = await request<{ Products: { docs: Product[] } }>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL as string,
        ALL_PRODUCTS_QUERY,
        {
          locale: router.locale,
          fallbackLocale: 'pl',
        }
      ).then(res =>
        res.Products.docs.filter(
          product =>
            !product.hidden &&
            product.parentGroup &&
            product.price &&
            product.price > 0
        )
      );
      setAllProductsData(newProducts);
    })();
  }, [router.locale]);

  useEffect(() => {
    const reccomendedProducts = [...allProductsData];
    // get 15 random products
    reccomendedProducts.sort(() => Math.random() - 0.5);
    reccomendedProducts.length = 15;
    setReccomendedProducts(reccomendedProducts);
  }, [allProductsData, globalSettings.drinksCategory]);

  // Drinks category
  useEffect(() => {
    const drinksGroupID =
      typeof globalSettings.drinksCategory === 'object'
        ? globalSettings.drinksCategory?.id
        : globalSettings.drinksCategory;
    const drinksData = allProductsData.filter(product => {
      const parentGroupID =
        typeof product.parentGroup === 'string'
          ? product.parentGroup
          : product?.parentGroup?.id;
      return parentGroupID === drinksGroupID;
    });
    setDrinksData(drinksData);
  }, [allProductsData, globalSettings.drinksCategory]);

  // GTM dataLayer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const item_list_name = searchParams.get('item_list_name');
    const item_list_id = searchParams.get('item_list_id');
    const index = searchParams.get('index');
    const quantity = searchParams.get('quantity');

    const productObj = {
      item_name: data.nameSyrve || data.name, // Name or ID is required.
      item_id: data.id,
      item_brand: 'MAMA Sushi',
      item_category: (data.parentGroup as Group).nameSyrve,
      item_list_name: item_list_name || undefined,
      item_list_id: item_list_id || undefined,
      index: index ? parseInt(index) : undefined,
      quantity: quantity ? parseInt(quantity) : undefined,
      price: data.price,
    };
    // @ts-expect-error
    window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
    // @ts-expect-error
    window?.dataLayer?.push({
      event: 'view_item',
      ecommerce: {
        items: [productObj],
      },
    });
  }, [data.id, data.name, data.nameSyrve, data.parentGroup, data.price]);

  // GTM EVENT FOR SLIDERS (RECOMMENDED PRODUCTS, DRINKS)
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      reccomendedProducts.length === 0 ||
      drinksData.length === 0
    )
      return;
    const recommendedItems = reccomendedProducts.map((product, idx) => {
      return {
        item_name: product.nameSyrve || product.name,
        item_id: product.id,
        item_brand: 'MAMA Sushi',
        item_category: (product.parentGroup as Group).nameSyrve,
        item_list_name: 'Recommended Products Slider',
        item_list_id: 'recommended-products-slider',
        index: idx,
        quantity: 1,
        price: product.price,
      };
    });
    const drinksItems = drinksData.map((product, idx) => {
      return {
        item_name: product.nameSyrve || product.name,
        item_id: product.id,
        item_brand: 'MAMA Sushi',
        item_category: (product.parentGroup as Group).nameSyrve,
        item_list_name: 'Drinks Slider',
        item_list_id: 'drinks-slider',
        index: idx,
        quantity: 1,
        price: product.price,
      };
    });
    // @ts-expect-error
    window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
    // @ts-expect-error
    window?.dataLayer?.push({
      event: 'view_item_list',
      ecommerce: {
        items: [...recommendedItems, ...drinksItems],
      },
    });
  }, [drinksData, reccomendedProducts]);
  return (
    <DefaultPageTemplate
      title={data.meta?.title ?? data.name}
      description={data.meta?.description}
      globalSettings={globalSettings}
      ogImage={ogImage}
      metaData={data.meta}
    >
      <ProductCover
        cover={data.heroImage as ProductsHeroesImage}
        alt={data.name}
      />
      <ProductInfo data={data} />
      {/* {data.content?.blocks &&
        data.content.blocks.map(block => {
          switch (block.blockType) {
            case 'products-slider-block':
              return (
                <ProductSlider
                  key={block.id}
                  title={block.title}
                  products={block.products as Product[]}
                />
              );
            default:
              return null;
          }
        })} */}
      {drinksData.length > 0 && (
        <ProductSlider
          title={t('productPage.addDrinksToOrder')}
          products={drinksData}
          analytics={{
            listName: 'Drinks Slider',
            listId: 'drinks-slider',
          }}
        />
      )}
      {reccomendedProducts.length > 0 && (
        <ProductSlider
          title={t('productPage.mightLikeIt')}
          products={reccomendedProducts as Product[]}
          analytics={{
            listName: 'Recommended Products Slider',
            listId: 'recommended-products-slider',
          }}
        />
      )}

      {data.description && (
        <section style={{ paddingTop: '8rem' }}>
          <Container>{data.description}</Container>
        </section>
      )}
    </DefaultPageTemplate>
  );
}
export const getStaticPaths: GetStaticPaths = async context => {
  const locales = context.locales as string[];
  const paths: GetStaticPathsResult['paths'] = [];
  const res = await request<{ Products: { docs: { slug: string }[] } }>(
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL as string,
    gql`
      {
        Products(limit: 999999) {
          docs {
            slug
          }
        }
      }
    `,
    undefined,
    {
      'x-payload-build-secret': process.env.PAYLOAD_BUILD_SECRET as string,
    }
  ).then(res => res.Products.docs);
  res.forEach(item => {
    locales.forEach(locale => {
      paths.push({
        params: {
          slug: item.slug,
        },
        locale,
      });
    });
  });
  return {
    paths,
    fallback: 'blocking',
  };
};
export const getStaticProps: GetStaticProps = async context => {
  const { locale = 'pl' } = context;
  const payloadAPI = new PayloadAPI({ locale });
  const slug = String(context.params?.slug);
  const data = await request<{
    Products: { docs: Product[] };
  }>(
    process.env.GRAPHQL_URL as string,
    PRODUCT_QUERY,
    {
      slug,
      locale,
      fallbackLocale: 'pl',
    },
    {
      'x-payload-build-secret': process.env.PAYLOAD_BUILD_SECRET as string,
    }
  ).then(res => res.Products.docs[0]);

  if (!data) {
    return {
      notFound: true,
    };
  }

  const tr = await serverSideTranslations(locale, ['common']);
  const i18n = createInstance({
    lng: tr?._nextI18Next?.initialLocale,
    ns: tr?._nextI18Next?.ns,
    resources: tr?._nextI18Next?.initialI18nStore,
    keySeparator: '.',
  });
  i18n.init();

  const globalSettings = await payloadAPI.getGlobalSettings();
  const descr = i18n.t('common:jsonld.product.description', {
    composition: data.composition,
    amount: data.quantity,
  });
  const ogImage =
    data.meta?.image ||
    (data.heroImage as ProductsHeroesImage)?.sizes?.desktop?.url ||
    null;

  const localeSegment = locale === 'pl' ? '' : `/${locale}`;
  data.meta = {
    ...data.meta,
    description: descr,
    jsonld: {
      '@type': 'Product',
      '@context': 'https://schema.org/',
      name: data.name,
      image: ogImage,
      brand: 'Mama Sushi',
      description: descr,
      price: data.price,
      currency: 'PLN',
      availability: 'https://schema.org/InStock',
      url: `https://www.mamasushi.eu${localeSegment}/product/${data.slug}`,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
      },
    },
  };
  mergeJsonLD(globalSettings, data);

  // interite over objects and remove syrveData property function including nested objects
  const removeSyrveData = (obj: any) => {
    for (const key in obj) {
      if (key === 'syrveData') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeSyrveData(obj[key]);
      }
    }
  };
  removeSyrveData(data);
  removeSyrveData(globalSettings);
  return {
    props: {
      globalSettings,
      data,
      pageType: 'product',
      ...tr,
    },
    revalidate: 60 * 5,
  };
};
