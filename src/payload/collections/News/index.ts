import { anyone } from '../../access/anyone';
import { admins } from '../../access/admins';
import { slugField } from '../../fields/slug';
import { CollectionConfig } from 'payload/types';

const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: {
      ru: 'Новость',
      en: 'News',
      uk: 'Новина',
      pl: 'Aktualność',
    },
    plural: {
      ru: 'Новости',
      en: 'News',
      uk: 'Новини',
      pl: 'Aktualności',
    },
  },

  fields: [
    // Slug
    slugField('title'),

    // Title
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Title',
        pl: 'Tytuł',
        uk: 'Заголовок',
        ru: 'Заголовок',
      },

      required: true,
      localized: true,
    },
    // Cover Image
    {
      type: 'row',
      fields: [
        {
          name: 'coverImgDesktop',
          type: 'upload',
          relationTo: 'media',
          label: {
            en: 'Cover Image Desktop',
            pl: 'Zdjęcie na komputer',
            uk: "Зображення на комп'ютер",
            ru: 'Изображение на компьютер',
          },
          localized: true,
          required: true,
        },
        {
          name: 'coverImgMobile',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: {
            en: 'Cover Image Mobile',
            pl: 'Zdjęcie na telefon',
            uk: 'Зображення на телефон',
            ru: 'Изображение на телефон',
          },
          localized: true,
        },
      ],
    },
    {
      name: 'date',
      type: 'date',
      label: {
        en: 'Date',
        pl: 'Data',
        uk: 'Дата',
        ru: 'Дата',
      },
      defaultValue: new Date().toISOString(),
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: anyone,
    update: admins,
    create: admins,
    delete: admins
  }
};
export default News;
