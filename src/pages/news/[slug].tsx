import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
// import getPayloadClient from '@/payload/payloadClient';
import { GlobalSetting, News } from '@/types/payload-types';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Article from '@/components/elements/article/article';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import { LOCALES } from '@/consts/locales';
import mergeJsonLD from '@/utils/mergeJsonLD';
// import { PayloadAPI } from '@/services/api/payload-api/payload.api';
interface Props {
  data: News;
  globalSettings: GlobalSetting;
}
export default function Page({ data, globalSettings }: Props) {
  return (
    <DefaultPageTemplate
      title={data.title}
      description={data.title}
      globalSettings={globalSettings}
      metaData={data.meta}
    >
      <Article newData={data} />
    </DefaultPageTemplate>
  );
}
export const getStaticPaths = (async () => {
  const payloadAPI = new PayloadAPI();
  const data = await payloadAPI.getNews({
    limit: 9999999,
    page: 1,
  });
  const paths = data.docs
    .map(item => {
      return LOCALES.map(locale => ({
        params: {
          slug: item.slug,
        },
        locale,
      }));
    })
    .flat();
  return {
    paths,
    fallback: 'blocking', // false or "blocking"
  };
}) satisfies GetStaticPaths;

export const getStaticProps: GetStaticProps = async context => {
  const { locale = 'pl' } = context;
  const slug = context.params?.slug;
  const payloadAPI = new PayloadAPI({ locale });
  const data = await payloadAPI.getNewsBySlug(slug);
  if (!data)
    return {
      notFound: true,
    };
  const globalSettings = await payloadAPI.getGlobalSettings();
  mergeJsonLD(globalSettings, data);
  return {
    props: {
      globalSettings,
      data,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 60,
  };
};
