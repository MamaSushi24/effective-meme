import type { Field } from 'payload/types';

import deepMerge from '../utilities/deepMerge';
import formatSlug from '../utilities/formatSlug';

type ALTField = (overrides?: Partial<Field>) => Field;

const altField: ALTField = (overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'alt',
      label: {
        en: 'Description',
        ru: 'Описание',
        pl: 'Opis',
        uk: 'Опис',
      },
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: "Localized description of the image. It's used for SEO.",
          ru: 'Локализованное описание изображения. Используется для SEO.',
          pl: 'Zlokalizowany opis obrazu. Jest używany do SEO.',
          uk: 'Локалізований опис зображення. Використовується для SEO.',
        },
      },
    },
    overrides
  );
export default altField;
