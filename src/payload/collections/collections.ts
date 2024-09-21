import { CollectionConfig } from 'payload/types';
import { admins } from '../access/admins';
import { SlugField } from '@nouance/payload-better-fields-plugin';
export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: {
      en: 'Collection',
      pl: 'Kolekcja',
      ru: 'Коллекция',
      uk: 'Колекція',
    },

    plural: {
      en: 'Collections',
      pl: 'Kolekcje',
      ru: 'Коллекции',
      uk: 'Колекції',
    },
  },

  fields: [
    // Name
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: {
          en: 'Localized name of the collection',
          pl: 'Nazwa kolekcji w różnych językach',
          ru: 'Локализованное название коллекции',
          uk: 'Локалізоване назва колекції',
        },
      },
    },
    // Slug
    ...SlugField(
      {
        name: 'slug',
        admin: {
          position: 'sidebar',
        },
      },
      {
        useFields: ['name'],
      }
    ),

    // Cover Image
    {
      name: 'heroImage',
      label: {
        en: 'Hero Image',
        pl: 'Zdjęcie w tle',
        ru: 'Изображение в заголовке',
        uk: 'Зображення в заголовку',
      },
      type: 'upload',
      relationTo: 'groups-heroes-images',
    },
    // Hidden
    {
      name: 'hidden',
      label: {
        en: 'Do not show on the website',
        pl: 'Nie pokazuj na stronie',
        ru: 'Не показывать на сайте',
        uk: 'Не показувати на сайті',
      },
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },

    // Products
    {
      name: 'products',
      label: {
        en: 'Products',
        pl: 'Produkty',
        ru: 'Продукты',
        uk: 'Продукти',
      },
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },

    // Nested Collections
    {
      name: 'children',
      label: {
        en: 'Nested Collections',
        pl: 'Zagnieżdżone kolekcje',
        ru: 'Вложенные коллекции',
        uk: 'Вкладені колекції',
      },
      type: 'relationship',
      relationTo: 'collections',
      hasMany: true,
    },
  ],
  timestamps: false,
  admin: {
    defaultColumns: ['name'],
    disableDuplicate: true,
    useAsTitle: 'name',
    listSearchableFields: ['name'],
  },
  defaultSort: 'name',
  access: {
    read: () => true,
    update: admins,
    create: admins,
    delete: admins,
  },
};
