import CategoriesList from '@/components/elements/categories-list/categories-list';
import CategoryCover from '@/components/elements/category-cover/category-cover';
import ProductGridSection from '@/components/sections/product-grid-section/product-grid-section';
import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import {
  Collection,
  GlobalSetting,
  Group,
  GroupsHeroesImage,
  Product,
} from '@/types/payload-types';
import mergeJsonLD from '@/utils/mergeJsonLD';
import axios from 'axios';
import request, { gql } from 'graphql-request';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from 'next/types';
import { useEffect, useMemo, useState } from 'react';
interface Props {
  data: Collection;
  globalSettings: GlobalSetting;
}
const GTM_LIST_NAME = 'Category Page';

export default function Page({ data, globalSettings }: Props) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    (data.products as Product[]) ?? []
  );
  const [selectedCategoryID, setSelectedCategoryID] = useState<string | null>(
    null
  );

  const [specialCategory, setSpecialCategory] = useState<string>('');

  const ogImage =
    data.meta?.image ||
    (data.heroImage as GroupsHeroesImage)?.sizes?.desktop?.url ||
    null;

  useEffect(() => {
    const getAllProducts = () => {
      const products = [...(data.products as Product[])];
      if (data.children) {
        (data.children as Collection[]).forEach(child => {
          child.products?.forEach(childProduct => {
            const isAlreadyInProducts = products.some(
              product => product.id === (childProduct as Product).id
            );
            if (!isAlreadyInProducts) {
              products.push(childProduct as Product);
            }
          });
        });
      }
      return products;
    };
    if (selectedCategoryID) {
      const newProducts =
        ((data.children as Collection[])?.find(
          category => category.id === selectedCategoryID
        )?.products as Product[]) ?? [];
      setFilteredProducts(newProducts);
    } else if (specialCategory === 'vegan') {
      const filtered = getAllProducts().filter(product => {
        return product.vegan === true;
      });
      setFilteredProducts(filtered);
    } else if (specialCategory === 'spicy') {
      const filtered = getAllProducts().filter(product => {
        return product.spicy === true;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(data.products as Product[]);
    }
  }, [data.children, data.products, selectedCategoryID, specialCategory]);

  // GTM dataLayer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const items = filteredProducts.map((product, idx) => {
      const categoryName = (product.parentGroup as Group)?.nameSyrve;
      const itemName = product.nameSyrve || product.name;

      return {
        item_name: itemName,
        item_id: product.id,
        price: product.price,
        item_brand: 'MAMA Sushi',
        item_category: categoryName,
        item_list_name: GTM_LIST_NAME,
        item_list_id: data.id,
        index: idx,
        quantity: 1,
      };
    });

    // Measure product views / impressions
    // @ts-expect-error
    window?.dataLayer?.push({ ecommerce: null }); // Clear the previous ecommerce object.
    // @ts-expect-error
    window?.dataLayer?.push({
      event: 'view_item_list',
      ecommerce: {
        items: items,
      },
    });
  }, [data.id, filteredProducts]);

  return (
    <DefaultPageTemplate
      title={data.meta?.title ?? data.name}
      description={data.meta?.description}
      ogImage={ogImage}
      globalSettings={globalSettings}
      metaData={data.meta}
    >
      <CategoryCover
        title={data.name}
        cover={data.heroImage as GroupsHeroesImage}
      />
      {(data.children as Collection[])?.length > 0 && (
        <CategoriesList
          data={data.children as Collection[]}
          products={data.products as Product[]}
          specialCategory={specialCategory}
          setCategoryID={setSelectedCategoryID}
          setSpecialCategory={setSpecialCategory}
        />
      )}
      <ProductGridSection
        products={filteredProducts}
        analytics={{
          list_name: GTM_LIST_NAME,
          list_id: data.id,
        }}
      />
    </DefaultPageTemplate>
  );
}
export const getStaticPaths: GetStaticPaths = async context => {
  const locales = context.locales as string[];
  const paths: GetStaticPathsResult['paths'] = [];
  const res = await request<{ Collections: { docs: { slug: string }[] } }>(
    process.env.NEXT_PUBLIC_SERVER_URL + '/api/graphql',
    gql`
      {
        Collections(limit: 99999) {
          docs {
            slug
          }
        }
      }
    `
  ).then(res => res.Collections.docs);
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
  const slug = context.params?.slug as string;
  const locale = context.locale || 'pl';
  const payloadAPI = new PayloadAPI({ locale });
  const collectionData = await payloadAPI.getCollectionBySlug(slug, locale);

  if (!collectionData) {
    return {
      notFound: true,
    };
  }
  collectionData.products = (collectionData.products as Product[]).filter(
    product => !product.hidden
  );
  collectionData.children =
    (collectionData.children as Collection[])?.map(collection => {
      collection.products = (collection.products as Product[]).filter(
        product => !product.hidden
      );
      return collection;
    }) ?? [];

  const globalSettings = await new PayloadAPI({ locale }).getGlobalSettings();
  mergeJsonLD(globalSettings, collectionData);

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
  removeSyrveData(collectionData);
  removeSyrveData(globalSettings);
  return {
    props: {
      data: collectionData,
      globalSettings,
      pageType: 'group',
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60,
  };
};
