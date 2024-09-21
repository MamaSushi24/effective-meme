import { admins } from '../access/admins';
import type { CollectionConfig } from 'payload/types';
import uploadFilenameFormat from '../hooks/upload-filename-format';

const Icons: CollectionConfig = {
  slug: 'icons',
  labels: {
    singular: {
      en: 'Icon',
      pl: 'Ikona',
      ru: 'Иконка',
      uk: 'Іконка',
    },
    plural: {
      en: 'Icons',
      pl: 'Ikony',
      ru: 'Иконки',
      uk: 'Іконки',
    },
  },
  upload: {
    staticDir: '../../storage/icons',
    staticURL: '/icons',
    mimeTypes: ['image/svg+xml'],
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  timestamps: false,
  admin: {
    group: {
      en: 'Uploads',
      pl: 'Załadowane',
      ru: 'Загруженные',
      uk: 'Завантажені',
    },
    description: {
      en: 'Icons for the website',
      pl: 'Ikony dla strony',
      ru: 'Иконки для сайта',
      uk: 'Іконки для сайту',
    },
  },

  fields: [],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default Icons;
