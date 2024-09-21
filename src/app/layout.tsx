// import 'reset-css-complete/reset.css';
import '@/styles/common.scss';
import { kashimaFont, montserratFont } from '@/utils/fonts';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next/types';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      translate="no"
      className={clsx(montserratFont.variable, kashimaFont.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata: Metadata = {
  verification: {
    other: {
      'facebook-domain-verification': '0oy2riuxe56dqtutmryxeuqcp2fupu',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Mama Sushi',
  },
};
