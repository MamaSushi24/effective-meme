import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import seo from '@payloadcms/plugin-seo';
import { slateEditor } from '@payloadcms/richtext-slate';
import dotenv from 'dotenv';
import path from 'path';
import { buildConfig } from 'payload/config';
import nestedDocs from '@payloadcms/plugin-nested-docs';

import Users from './collections/Users';
import Media from './collections/Media';
import Allergens from './collections/Allergens';
import { Groups } from './collections/Groups';
import News from './collections/News';
import Orders from './collections/Orders';
import Products from './collections/Products';
import DeliveryPage from './globals/DeliveryPage';
import Settings from './globals/Settings';
import HomePage from './globals/HomePage';
import ProductsCardsImages from './collections/ProductsCardsImages';
import OGImages from './collections/OGImages';
import AboutPage from './globals/AboutPage';
import GroupsHeroesImages from './collections/GroupsHeroesImages';
import ProductHeroesImages from './collections/ProductHeroesImages';
import Icons from './collections/Icons';
import DiscountsCodes from './collections/DiscountsCodes';
import DeliveryZones from './collections/DeliveryZones';
import endpointGetAddressPredictions from './endpoints/syrve/get-address-predictions';
import endpointGetDeliveryZoneByAddress from './endpoints/syrve/get-delivery-zone-by-address';
import calculateOrderEndpoint from './endpoints/order/calculate';
import DiscountStrategiesCollection from './collections/DiscountStrategies';
import { Collections } from './collections/collections';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
const SERVER_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL;
export default buildConfig({
  collections: [
    Users,
    Media,
    Icons,
    OGImages,
    Allergens,
    Groups,
    Collections,
    GroupsHeroesImages,
    News,
    Orders,
    DiscountsCodes,
    Products,
    ProductsCardsImages,
    ProductHeroesImages,
    DeliveryZones,
    DiscountStrategiesCollection,
  ],
  globals: [Settings, HomePage, DeliveryPage, AboutPage],
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  localization: {
    locales: [
      {
        label: 'Polski',
        code: 'pl',
      },
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Русский',
        code: 'ru',
      },
      {
        label: 'Українська',
        code: 'uk',
      },
    ],
    defaultLocale: 'pl',
    fallback: true,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, '../types/payload-types.ts'),
  },

  serverURL: SERVER_URL,
  // cors: [SERVER_URL || ''].filter(Boolean),
  csrf: [SERVER_URL || ''].filter(Boolean),
  cors: '*',
  debug: true,
  telemetry: false,
  rateLimit: {
    trustProxy: true,
    skip: req => {
      const secret = req.headers['x-payload-build-secret'];

      if (secret === process.env.PAYLOAD_BUILD_SECRET) {
        // req.payload.logger.info('Skipping rate limit for build');
        return true;
      }
      return false;
    },
  },
  endpoints: [
    endpointGetAddressPredictions,
    endpointGetDeliveryZoneByAddress,
    calculateOrderEndpoint,
  ],
  routes: {
    admin: '/r2d2',
  },
  plugins: [
    seo({
      collections: ['products', 'groups', 'news', 'collections'],
      globals: ['home-page', 'delivery-page', 'about-page'],
      uploadsCollection: 'og-images',
      generateURL: args => {
        const baseURL = `${SERVER_URL}/${args.locale}`;
        switch (args.slug) {
          case 'products': {
            // @ts-expect-error
            const product = args.doc.fields;
            return baseURL + '/products/' + product.slug.value;
          }

          case 'home-page':
            return baseURL;
          case 'delivery-page':
            return baseURL + '/delivery';
          case 'about-page':
            return baseURL + '/about';
          default:
            return '';
        }
      },
      fields: [
        {
          name: 'jsonld',
          type: 'json',
          label: 'JSON-LD',
          localized: true,
          required: false,
        },
      ],
      interfaceName: 'MetaData',
    }),
    // nestedDocs({
    //   collections: ['collections'],
    // }),
  ],
});
