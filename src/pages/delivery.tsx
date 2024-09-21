import DefaultPageTemplate from '@/layouts/default-page-template/default-page-template';
import { DeliveryPage, GlobalSetting } from '@/types/payload-types';
import { GetStaticProps } from 'next';

interface Props {
  globalSettings: GlobalSetting;
  data: DeliveryPage;
}
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DeliverySection from '@/components/sections/delivery-section/delivery-section';
import { PayloadAPI } from '@/services/api/payload-api/payload.api';
import { useTranslation } from 'next-i18next';
import mergeJsonLD from '@/utils/mergeJsonLD';

export default function Index({ globalSettings, data }: Props) {
  const { t } = useTranslation('common');
  return (
    <>
      <DefaultPageTemplate
        title={data.meta?.title ?? t('navigation.deliveryPayment')}
        description={data.meta?.description ?? t('navigation.deliveryPayment')}
        ogImage={data.meta?.image}
        globalSettings={globalSettings}
        metaData={data.meta}
      >
        <DeliverySection zones={data.zones} />
      </DefaultPageTemplate>
    </>
  );
}

export const getStaticProps: GetStaticProps = async context => {
  const locale = context.locale || 'pl';
  const payloadAPI = new PayloadAPI({ locale });
  const globalSettings = await payloadAPI.getGlobalSettings();
  const data = await payloadAPI.getDeliveryPage();
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
