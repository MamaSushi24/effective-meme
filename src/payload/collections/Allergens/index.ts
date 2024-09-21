import { admins } from '../../access/admins';
import { CollectionConfig } from 'payload/types';

const Allergens: CollectionConfig = {
  slug: 'allergens',
  labels: {
    singular: {
      en: 'Allergen',
      pl: 'Alergen',
      uk: 'Алерген',
      ru: 'Аллерген',
    },
    plural: {
      en: 'Allergens',
      pl: 'Alergeny',
      uk: 'Алергени',
      ru: 'Аллергены',
    },
  },
  fields: [
    {
      type: 'upload',
      name: 'icon',
      label: {
        en: 'Icon',
        pl: 'Ikona',
        uk: 'Іконка',
        ru: 'Иконка',
      },
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: {
          equals: 'image/svg+xml',
        },
      },
    },
    {
      name: 'name',
      label: {
        en: 'Name',
        pl: 'Nazwa',
        uk: "Ім'я",
        ru: 'Имя',
      },
      type: 'text',
      localized: true,
      required: true,
    },
  ],
  timestamps: false,
  admin: {
    useAsTitle: 'name',
    disableDuplicate: true,
    group: {
      en: 'Nomenclature',
      pl: 'Nomenklatura',
      uk: 'Номенклатура',
      ru: 'Номенклатура',
    },
  },
  access: {
    read: () => true,
    update: admins,
    create: admins,
    delete: admins,
  },
};

export default Allergens;
