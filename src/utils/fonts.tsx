import { Montserrat } from 'next/font/google';
import localFont from 'next/font/local';

export const montserratFont = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  fallback: ['sans-serif'],
  style: 'normal',
  variable: '--font-montserrat',
});
export const kashimaFont = localFont({
  src: '../fonts/kashimarusbycop.woff2',
  display: 'swap',
  style: 'normal',
  fallback: ['sans-serif'],
  variable: '--font-kashima',
  weight: '400',
  preload: true,
});
