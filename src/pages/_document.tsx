import { useTranslation } from 'next-i18next';
import { Html, Head, Main, NextScript } from 'next/document';
import Image from 'next/image';
import Script from 'next/script';
// import { GoogleTagManager } from '@next/third-parties/google';
export default function Document() {
  return (
    <Html translate="no">
      <Head>
        {/* <!-- Google Tag Manager --> */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PH76MCFX');
        `}
        </Script>
        {/* <!-- End Google Tag Manager -->
         */}

        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1534718313970511');
            fbq('track', 'PageView');
            `}
        </Script>

        {/* <!-- Hotjar Tracking Code for https://www.mamasushi.eu/ --> */}
        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:4952564,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      </Head>
      <body>
        {/* <!-- Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PH76MCFX"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          ></iframe>
        </noscript>
        {/* <!-- End Google Tag Manager (noscript) --> */}

        <noscript>
          <Image
            unoptimized
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1534718313970511&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <Main />
        <div id="myportal" />
        <NextScript />
      </body>
    </Html>
  );
}
