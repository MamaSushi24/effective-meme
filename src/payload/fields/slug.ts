import type { Field } from 'payload/types';

import deepMerge from '../utilities/deepMerge';
import formatSlug from '../utilities/formatSlug';

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field;

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      // unique: true,
      // localized: true,
      required: true,
      admin: {
        position: 'sidebar',
        disableBulkEdit: true,
        description: {
          en: 'Localized slug of the document. Used in the URL.',
          pl: 'Lokalizowany slug dokumentu. Używany w adresie URL.',
          ru: 'Локализованный slug документа. Используется в URL.',
          uk: 'Локалізований slug документа. Використовується в URL.',
        },
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides
  );
