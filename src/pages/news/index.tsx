import NewsSection from '@/components/sections/news-section/news-section';
import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';

import { GlobalSetting, News } from '@/types/payload-types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next/types';

interface Props {
  globalSettings: GlobalSetting;
  data: News[];
}
export default function Page({ globalSettings, data }: Props) {
  const { t } = useTranslation('common');
  return (
    <DefaultPageTemplate
      title={t('navigation.news')}
      description={t('navigation.news')}
      globalSettings={globalSettings}
    >
      <NewsSection news={data} />
    </DefaultPageTemplate>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const locale = context.locale || 'pl';
  const payloadAPI = new PayloadAPI({
    locale,
  });

  const data = await payloadAPI.getNews();
  const globalSettings = await payloadAPI.getGlobalSettings();
  return {
    props: {
      data: data.docs,
      globalSettings,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};
