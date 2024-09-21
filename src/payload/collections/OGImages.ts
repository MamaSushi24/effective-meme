import { admins } from '../access/admins';
import type { CollectionConfig } from 'payload/types';
import uploadFilenameFormat from '../hooks/upload-filename-format';

const OGImages: CollectionConfig = {
  slug: 'og-images',
  labels: {
    singular: {
      en: 'OG Image',
      pl: 'OG Image',
      ru: 'OG Image',
      uk: 'OG Image',
    },
    plural: {
      en: 'OG Images',
      pl: 'OG Images',
      ru: 'OG Images',
      uk: 'OG Images',
    },
  },
  upload: {
    staticDir: '../../storage/og-images',
    staticURL: '/og-images',
    mimeTypes: ['image/*'],
    resizeOptions: {
      width: 1200,
      height: 630,
      fit: 'cover',
      position: 'center',
    },
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
  timestamps: false,

  admin: {
    group: {
      en: 'Uploads',
      pl: 'Załadowane',
      ru: 'Загруженные',
      uk: 'Завантажені',
    },
    description: {
      en: 'Images for Open Graph tags. They will be used when sharing links on social media. Recommended size: 1200x630px.',
      pl: 'Zdjęcia dla tagów Open Graph. Będą używane podczas udostępniania linków w mediach społecznościowych. Zalecany rozmiar: 1200x630px.',
      ru: 'Изображения для тегов Open Graph. Они будут использоваться при публикации ссылок в социальных сетях. Рекомендуемый размер: 1200x630px.',
      uk: 'Зображення для тегів Open Graph. Вони будуть використовуватися під час публікації посилань в соціальних мережах. Рекомендований розмір: 1200x630px.',
    },
  },

  fields: [],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default OGImages;
