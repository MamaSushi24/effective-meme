import uploadFilenameFormat from '../../hooks/upload-filename-format';
import { admins } from '../../access/admins';
import type { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // disableLocalStorage: true,
    staticDir: '../../storage/media',
    staticURL: '/media',
    formatOptions: {
      format: 'webp',
      options: {
        quality: 100,
      },
    },
  },
  access: {
    read: () => true,
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'alt',
      label: {
        default: 'Alt Text',
        en: 'Alt Text',
        pl: 'Tekst alternatywny',
        ru: 'Альтернативный текст',
        uk: 'Альтернативний текст',
      },
      type: 'text',
      // required: true,
      localized: true,
    },
  ],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default Media;
