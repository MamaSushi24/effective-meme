import { admins } from '../access/admins';
import type { CollectionConfig } from 'payload/types';
import uploadFilenameFormat from '../hooks/upload-filename-format';

const ProductsHeroesImages: CollectionConfig = {
  slug: 'products-heroes-images',
  labels: {
    singular: {
      ru: 'Полноразмерное изображение продукта',
      en: 'Product full size image',
      pl: 'Produkt pełnowymiarowe zdjęcie',
      uk: 'Продукт повнорозмірне зображення',
    },
    plural: {
      ru: 'Полноразмерные изображения продуктов',
      en: 'Product full size images',
      pl: 'Produkty pełnowymiarowe zdjęcia',
      uk: 'Продукти повнорозмірні зображення',
    },
  },
  upload: {
    staticDir: '../../storage/products-heroes-images',
    staticURL: '/products-heroes-images',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'mobile',
        width: 430,
        height: 900,
        fit: 'cover',
        position: 'center',
      },
      {
        name: 'tablet',
        width: 1024,
        fit: 'cover',
        height: 2144,
        position: 'center',
      },
      {
        name: 'desktop',
        width: 1770,
        height: 830,
        fit: 'cover',
        position: 'center',
      },
    ],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 100,
      },
    },
    adminThumbnail: 'desktop',
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
      en: 'Images for background of first sections. Images are automatically resized and cropped to fit the design of the website. Recommended size: 4572x2144px',
      pl: 'Zdjęcia do tła pierwszych sekcji. Obrazy są automatycznie zmieniane rozmiar i kadrowane, aby pasowały do projektu strony internetowej. Zalecany rozmiar: 4572x2144px',
      ru: 'Изображения для фона первых секций. Изображения автоматически изменяют размер и обрезаются под дизайн сайта. Рекомендуемый размер: 4572x2144px',
      uk: 'Зображення для фону перших секцій. Зображення автоматично змінюють розмір та обрізаються під дизайн сайту. Рекомендований розмір: 4572x2144px',
    },
  },

  fields: [],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default ProductsHeroesImages;
