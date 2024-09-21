import { GlobalConfig } from 'payload/types';
import { admins } from '../access/admins';

const productPage: GlobalConfig = {
  slug: 'about-page',
  fields: [{ name: 'seoDescription', type: 'ui', admin: {} }],
  access: {
    read: () => true,
    update: admins,
  },
};
