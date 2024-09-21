import { slugField } from '../../fields/slug';
import { CollectionConfig } from 'payload/types';
import autoFillFieldsFromCRM from './hooks/autoFillFieldsFromCRM';
import { admins } from '../../access/admins';
export const Groups: CollectionConfig = {
  slug: 'groups',
  labels: {
    singular: {
      en: 'Group',
      pl: 'Grupa',
      ru: 'Группа',
      uk: 'Група',
    },

    plural: {
      en: 'Groups',
      pl: 'Grupy',
      ru: 'Группы',
      uk: 'Групи',
    },
  },

  fields: [
    // ID
    {
      name: 'id',
      type: 'text',
      index: true,
      unique: true,
      required: true,
      admin: {
        hidden: true,
      },
    },
    // Slug
    slugField('name'),
    // Name
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description: {
          en: 'Localized name of the group',
          pl: 'Nazwa grupy w różnych językach',
          ru: 'Локализованное название группы',
          uk: 'Локалізоване назва групи',
        },
      },
    },
    // Name Syrve
    {
      name: 'nameSyrve',
      type: 'text',
      label: {
        en: 'Name Syrve',
        pl: 'Nazwa Syrve',
        ru: 'Название Syrve',
        uk: 'Назва Syrve',
      },

      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Name of the group in Syrve',
          pl: 'Nazwa grupy w Syrve',
          ru: 'Название группы в Syrve',
          uk: 'Назва групи в Syrve',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['nameSyrve'];
          },
        ],
        afterRead: [
          ({ data }) => {
            if (!data?.syrveData) return;
            return data.syrveData.name;
          },
        ],
      },
    },
    // Parent Group
    {
      name: 'parentGroup',
      type: 'text',
      label: {
        en: 'Parent Group',
        pl: 'Grupa nadrzędna',
        ru: 'Родительская группа',
        uk: 'Батьківська група',
      },

      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            // ensures data is not stored in DB
            delete siblingData['parentGroup'];
          },
        ],
        afterRead: [
          ({ data }) => {
            if (!data?.syrveData) return;
            return data.syrveData?.parentGroup;
          },
        ],
      },
    },
    // Syrve Data
    {
      name: 'syrveData',
      type: 'json',
      required: true,
      // hidden: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        hidden: true,
      },
    },

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
  ],
  timestamps: false,
  admin: {
    defaultColumns: ['name'],
    disableDuplicate: true,
    useAsTitle: 'name',
    listSearchableFields: ['name'],
    group: {
      en: 'Nomenclature',
      pl: 'Nazewnictwo',
      ru: 'Номенклатура',
      uk: 'Номенклатура',
    },
  },
  hooks: {
    beforeValidate: [autoFillFieldsFromCRM],
  },
  defaultSort: 'name',
  access: {
    read: () => true,
    update: admins,
    create: () => false,
    delete: admins,
  },
};
