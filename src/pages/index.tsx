import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
import {
  GlobalSetting,
  Group,
  HomePage,
  Media,
  News,
  Product,
} from '@/types/payload-types';
import { GetStaticProps } from 'next';

interface Props {
  data: HomePage;
  globalSettings: GlobalSetting;
}
// import NewsSlider from '@/components/sections/news-slider/news-slider';
import CategorySection from '@/components/sections/category-section/category-section';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import HeroSection from '@/components/sections/hero-section/hero-section';
import DeliverySection from '@/components/sections/delivery-section/delivery-section';
import GallerySection from '@/components/sections/gallery-section/gallery-section';
import { useEffect } from 'react';
import mergeJsonLD from '@/utils/mergeJsonLD';
import RichText from '@/components/elements/RichText';
import dynamic from 'next/dynamic';
const NewsSlider = dynamic(() =>
  import('@/components/sections/news-slider/news-slider').then(
    module => module.default
  )
);
export default function Index({ data, globalSettings }: Props) {
  const { blocks } = data;
  // GTM dataLayer
  useEffect(() => {
    if (typeof window === 'undefined' || !blocks) return;
    const categoriesBlocks = blocks.filter(
      block => block.blockType === 'group-presentation-block' && block.products
    );
    const items = categoriesBlocks.reduce((acc, block, blockIdx) => {
      if (block.blockType !== 'group-presentation-block' || !block?.products)
        return acc;
      const products = block.products as Product[];
      const blockItems = products.map((product, idx) => {
        const categoryName = (product.parentGroup as Group)?.nameSyrve;
        const itemName = product.nameSyrve || product.name;

        return {
          item_name: itemName,
          item_id: product.id,
          price: product.price,
          item_brand: 'MAMA Sushi',
          item_category: categoryName,
          item_list_name: 'Category Section',
          item_list_id: block.id,
          index: idx,
          quantity: 1,
        };
      });
      return [...acc, ...blockItems];
    }, []);

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
  }, [blocks]);
  return (
    <DefaultPageTemplate
      title={data.meta?.title ?? globalSettings.siteName}
      description={data.meta?.description}
      ogImage={data.meta?.image}
      globalSettings={globalSettings}
      metaData={data.meta}
    >
      <HeroSection />
      {blocks?.map((block, index) => {
        switch (block.blockType) {
          case 'group-presentation-block':
            const group = block.group as Group;
            const title = group.name;
            const products = block.products as Product[];
            const headerBackgroundImageDesktop = block.headerBackgroundImage
              ?.desktop as Media;
            const headerBackgroundImageMobile = block.headerBackgroundImage
              ?.mobile as Media;
            const link = `/group/${group.slug}`;
            return (
              <CategorySection
                title={title}
                products={products}
                headerBackgroundImageDesktop={headerBackgroundImageDesktop}
                headerBackgroundImageMobile={headerBackgroundImageMobile}
                link={link}
                key={block.id}
                id={block.id || block.blockType + index}
              />
            );
          case 'news-slider-block':
            if (!block.news) return null;
            return <NewsSlider key={block.id} data={block.news as News[]} />;
          case 'textblock':
            return (
              <section key={block.id}>
                {<RichText content={block.content}></RichText>}
              </section>
            );
          default:
            return null;
        }
      })}
      <GallerySection />
      <DeliverySection single />
    </DefaultPageTemplate>
  );
}

export const getStaticProps: GetStaticProps = async context => {
  const locale = context.locale || 'pl';
  const payloadAPI = new PayloadAPI({ locale });
  const globalSettings = await payloadAPI.getGlobalSettings();
  const data = await payloadAPI.getHomePage();
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
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60,
  };
};
