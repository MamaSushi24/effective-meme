import Head from 'next/head';
import Footer from '../../components/containers/footer/footer';
import Header from '../../components/containers/header/header';

import styles from './default-page-template.module.scss';
import Sidebar from '@/components/containers/sidebar/sidebar';
import { GlobalSetting, MetaData, OgImage } from '@/types/payload-types';
import GlobalSettingsContext from '@/context/global-settings-context';
// import ButtonScrollUp from '@/components/elements/button-scroll-up/button-scroll-up';
import dynamic from 'next/dynamic';
import formatPageTitle from '@/utils/format-page-title';
import { useRouter } from 'next/router';
const ModalPromotion = dynamic(
  () =>
    import('@/components/elements/modal-promotion/modal-promotion').then(
      module => module.default
    ),
  { ssr: false }
);
const ScheduleModal = dynamic(
  () =>
    import('@/components/elements/schedule-modal/schedule-modal').then(
      module => module.default
    ),
  { ssr: false }
);
const Cart = dynamic(
  () =>
    import('@/components/containers/cart/cart').then(module => module.default),
  { ssr: false }
);

const ButtonScrollUp = dynamic(
  () =>
    import('@/components/elements/button-scroll-up/button-scroll-up').then(
      module => module.default
    ),
  { ssr: false }
);
interface DefaultPageTemplateProps {
  children: React.ReactNode;
  title: string;
  description?: string | null;
  ogImage?: string | null | OgImage;
  globalSettings: GlobalSetting;
  showButtonScrollUp?: boolean;
  metaData?: MetaData;
  jsonLd?: MetaData['jsonld'][];
}

const JsonLd = ({ data }: { data?: any }) => {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
export default function DefaultPageTemplate({
  children,
  title,
  description,
  ogImage,
  globalSettings,
  showButtonScrollUp = true,
  metaData,
  jsonLd,
  ...props
}: DefaultPageTemplateProps): JSX.Element {
  const router = useRouter();
  const ogImageUrl =
    typeof ogImage === 'string' ? ogImage : ogImage?.url || null;

  const hideQueryParams = (url: string) => {
    return url.split('?')[0];
  };
  const addPrefix = (url: string) => {
    return `https://www.mamasushi.eu${url}`;
  };

  const addLocalePrefix = (url: string, locale?: string) => {
    if (locale === 'pl' || !locale) return url;
    return `/${locale}${url}`;
  };
  return (
    <>
      <Head>
        <title>{formatPageTitle(globalSettings.siteName, title)}</title>
        {description && <meta name="description" content={description} />}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
        <meta
          name="facebook-domain-verification"
          content="0oy2riuxe56dqtutmryxeuqcp2fupu"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={formatPageTitle(globalSettings.siteName, title)}
        />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
        {/* {metaData?.jsonld && <JsonLd data={metaData.jsonld} />} */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />

        <link rel="preconnect" href="https://region1.google-analytics.com/" />
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link
          key={'canonical-link'}
          rel="canonical"
          href={addPrefix(
            addLocalePrefix(hideQueryParams(router.asPath), router.locale)
          )}
        />
        {router?.locales?.map(locale => {
          const localeSegment = locale === 'pl' ? '' : `/${locale}`;
          return (
            <link
              key={`alternate-link-${locale}`}
              rel="alternate"
              hrefLang={locale}
              href={addPrefix(
                `${localeSegment}${hideQueryParams(router.asPath)}`
              )}
            />
          );
        })}
      </Head>
      {metaData?.jsonld &&
        metaData.jsonld instanceof Array &&
        metaData.jsonld.map((item, index) => (
          <JsonLd key={index} data={item} />
        ))}
      <Sidebar data={globalSettings.sidebar} />
      <div className={styles.inner}>
        <Header globalSettings={globalSettings} />
        <GlobalSettingsContext.Provider value={globalSettings}>
          <Cart />
        </GlobalSettingsContext.Provider>
        <main {...props} className={styles.main}>
          {children}
        </main>
        <Footer data={globalSettings} />
      </div>
      <GlobalSettingsContext.Provider value={globalSettings}>
        <ScheduleModal />
        <ModalPromotion />
      </GlobalSettingsContext.Provider>
      {showButtonScrollUp && <ButtonScrollUp />}
    </>
  );
}
