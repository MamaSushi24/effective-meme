import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
import { AboutPage, GlobalSetting } from '@/types/payload-types';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';

interface Props {
  globalSettings: GlobalSetting;
  data: AboutPage;
}
import AboutSection from '@/components/sections/about-section/about-section';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import mergeJsonLD from '@/utils/mergeJsonLD';

export default function Index({ globalSettings, data }: Props) {
  const { t } = useTranslation('common');
  return (
    <>
      <DefaultPageTemplate
        title={data.meta?.title ?? t('navigation.aboutUs')}
        description={data.meta?.description ?? t('navigation.aboutUs')}
        ogImage={data.meta?.image}
        globalSettings={globalSettings}
        showButtonScrollUp={false}
        metaData={data.meta}
      >
        <AboutSection />
      </DefaultPageTemplate>
    </>
  );
}
export const getStaticProps: GetStaticProps = async context => {
  const locale = context.locale || 'pl';
  const payloadAPI = new PayloadAPI({ locale });
  const globalSettings = await payloadAPI.getGlobalSettings();
  const data = await payloadAPI.getAboutPage();
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
