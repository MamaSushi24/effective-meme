import { admins } from '../access/admins';
import type { CollectionConfig } from 'payload/types';
import altField from '../fields/alt';
import uploadFilenameFormat from '../hooks/upload-filename-format';

const GroupsHeroesImages: CollectionConfig = {
  slug: 'groups-heroes-images',
  labels: {
    singular: {
      ru: 'Полноразмерное изображение группы',
      en: 'Group full size image',
      pl: 'Grupa pełnowymiarowe zdjęcie',
      uk: 'Група повнорозмірне зображення',
    },
    plural: {
      ru: 'Полноразмерные изображения групп',
      en: 'Group full size images',
      pl: 'Grupy pełnowymiarowe zdjęcia',
      uk: 'Групи повнорозмірні зображення',
    },
  },
  upload: {
    staticDir: '../../storage/groups-heroes-images',
    staticURL: '/groups-heroes-images',
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
        height: 1080,
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
      en: 'Images for background of first sections. Images are automatically resized and cropped to fit the design of the website. Recommended size: 3145x1920px',
      pl: 'Zdjęcia do tła pierwszych sekcji. Obrazy są automatycznie zmieniane rozmiar i kadrowane, aby pasowały do projektu strony internetowej. Zalecany rozmiar: 3145x1920px',
      ru: 'Изображения для фона первых секций. Изображения автоматически изменяют размер и обрезаются под дизайн сайта. Рекомендуемый размер: 3145x1920px',
      uk: 'Зображення для фону перших секцій. Зображення автоматично змінюють розмір та обрізаються під дизайн сайту. Рекомендований розмір: 3145x1920px',
    },
  },

  fields: [altField()],
  hooks: {
    beforeOperation: [uploadFilenameFormat],
  },
};
export default GroupsHeroesImages;
