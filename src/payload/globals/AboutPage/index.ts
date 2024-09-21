import { GlobalConfig } from 'payload/types';
import { admins } from '../../access/admins';
const AboutPage: GlobalConfig = {
  slug: 'about-page',
  fields: [],
  access: {
    read: () => true,
    update: admins,
  },
};

export default AboutPage;
