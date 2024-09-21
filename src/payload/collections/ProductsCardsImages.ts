import { admins } from '../access/admins';
import type { CollectionConfig } from 'payload/types';
import uploadFilenameFormat from '../hooks/upload-filename-format';

const ProductsCardsImages: CollectionConfig = {
  slug: 'products-cards-images',
  labels: {
    singular: {
      en: 'Products Cards Image',
      pl: 'Zdjęcie karty produktu',
      ru: 'Изображение карточки товара',
      uk: 'Зображення картки товару',
    },
    plural: {
      en: 'Products Cards Images',
      pl: 'Zdjęcia kart produktów',
      ru: 'Изображения карточек товаров',
      uk: 'Зображення карток товарів',
    },
  },

  upload: {
    staticDir: '../../storage/products-cards-images',
    staticURL: '/products-cards-images',
    mimeTypes: ['image/*'],
    // imageSizes: [
    //   {
    //     name: 'desktop',
    //     width: 510,
    //     height: 591,
    //     fit: 'cover',
    //     position: 'center',
    //   },
    //   {
    //     name: 'tablet',
    //     width: 1024,
    //     fit: 'cover',
    //     height: 1186,
    //   },
    //   {
    //     name: 'mobile',
    //     width: 430,
    //     height: 498,
    //   },
    // ],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 100,
      },
    },
    // adminThumbnail: 'mobile',
    // focalPoint: false,
    resizeOptions: {
      width: 1020,
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
      en: 'Images for products cards. Recommended size: 1024x1186',
      pl: 'Zdjęcia dla kart produktów. Zalecany rozmiar: 1024x1186',
      ru: 'Изображения для карточек товаров. Рекомендуемый размер: 1024x1186',
      uk: 'Зображення для карток товарів. Рекомендований розмір: 1024x1186',
    },
  },
  fields: [],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default ProductsCardsImages;
