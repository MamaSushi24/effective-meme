import { CollectionConfig } from 'payload/types';
import autoFillFromSyrveData from './hooks/autoFillFromSyrveData';
import { admins } from '../../access/admins';
import { ColourTextField } from '@nouance/payload-better-fields-plugin';
const DeliveryZones: CollectionConfig = {
  slug: 'delivery-zones',
  labels: {
    singular: {
      en: 'Delivery Zone',
      ru: 'Зона доставки',
      pl: 'Strefa dostawy',
      uk: 'Зона доставки',
    },
    plural: {
      en: 'Delivery Zones',
      ru: 'Зоны доставки',
      pl: 'Strefy dostawy',
      uk: 'Зони доставки',
    },
  },
  fields: [
    //Name
    {
      name: 'name',
      type: 'text',
      localized: true,
      label: {
        en: 'Name',
        ru: 'Название',
        pl: 'Nazwa',
        uk: 'Назва',
      },
      required: true,
    },
    // Name in CRM
    {
      name: 'nameInSyrve',
      type: 'text',
      unique: true,
      localized: true,
      label: {
        en: 'Name in Syrve',
        ru: 'Название в Syrve',
        pl: 'Nazwa w Syrve',
        uk: 'Назва в Syrve',
      },
      required: true,
    },

    // Description
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: {
        en: 'Description',
        ru: 'Описание',
        pl: 'Opis',
        uk: 'Опис',
      },
    },
    // Price
    {
      name: 'price',
      type: 'number',
      label: {
        en: 'Price',
        ru: 'Цена',
        pl: 'Cena',
        uk: 'Ціна',
      },
      required: true,
    },
    // Coordinates
    {
      name: 'coordinates',
      label: {
        en: 'Coordinates',
        ru: 'Координаты',
        pl: 'Współrzędne',
        uk: 'Координати',
      },
      type: 'json',
      required: true,
    },

    // Colour
    ...ColourTextField({
      name: 'colour',
    }),
  ],
  hooks: {
    beforeValidate: [autoFillFromSyrveData],
  },
  timestamps: false,
  admin: {
    defaultColumns: ['name', 'nameInSyrve', 'colour'],
    disableDuplicate: true,
    useAsTitle: 'name',
    // listSearchableFields: ['label'],
    group: {
      en: 'Nomenclature',
      ru: 'Номенклатура',
      pl: 'Nomenklatura',
      uk: 'Номенклатура',
    },
  },
  access: {
    read: () => true,
    update: admins,
    create: () => true,
    delete: admins,
  },
};
export default DeliveryZones;
