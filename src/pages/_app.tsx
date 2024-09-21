import 'reset-css-complete/reset.css';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import useSetVPVars from '@/hooks/use-set-vp-vars';
import { SingletonHooksContainer } from 'react-singleton-hook';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { montserratFont, kashimaFont } from '../utils/fonts';

const fireFacebookPixel = (url: string) => {
  const getEventName = () => {
    if (url.includes('group')) return 'GroupView';
    if (url.includes('product')) return 'ContentView';
    return 'PageView';
  };
  const eventName = getEventName();
  // @ts-ignore
  if (eventName) fbq('track', eventName);
};
function App({ Component, pageProps }: AppProps) {
  useSetVPVars();
  const router = useRouter();
  useEffect(() => {
    // the below will only fire on route changes (not initial load - that is handled in the script below)

    router.events.on('routeChangeComplete', fireFacebookPixel);
    return () => {
      router.events.off('routeChangeComplete', fireFacebookPixel);
    };
  }, [router.events]);

  return (
    <>
      {/* <Head>
        
      </Head> */}
      <style jsx global>
        {`
          html {
            --font-montserrat: ${montserratFont.style.fontFamily};
            --font-kashima: ${kashimaFont.style.fontFamily};
            font-family: ${montserratFont.style.fontFamily};
          }
        `}
      </style>
      <SingletonHooksContainer />
      <Component {...pageProps} />
    </>
  );
}
export default appWithTranslation(App);
