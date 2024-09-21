import { GlobalConfig } from 'payload/types';
import ColorPickerField from './components/field';
import { admins } from '../../access/admins';
const DeliveryPage: GlobalConfig = {
  slug: 'delivery-page',
  access: {
    read: () => true,
    update: admins,
  },
  fields: [
    {
      type: 'array',
      name: 'zones',
      required: true,
      label: {
        en: 'Zones',
        pl: 'Strefy',
        uk: 'Зони',
        ru: 'Зоны',
      },
      fields: [
        {
          type: 'text',
          name: 'color',
          label: {
            en: 'Color',
            pl: 'Kolor',
            uk: 'Колір',
            ru: 'Цвет',
          },
          required: true,
          admin: {
            components: {
              Field: ColorPickerField,
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            en: 'Description',
            pl: 'Opis',
            uk: 'Опис',
            ru: 'Описание',
          },
          localized: true,
          required: true,
        },
      ],
    },
  ],
};

export default DeliveryPage;
