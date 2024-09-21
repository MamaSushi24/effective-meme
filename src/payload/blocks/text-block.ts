import { Block } from 'payload/types';
export const TextBlock: Block = {
  slug: 'textblock',
  labels: {
    singular: {
      en: 'Text Block',
      pl: 'Blok tekstu',
      ru: 'Текстовый блок',
      uk: 'Текстовий блок',
    },
    plural: {
      en: 'Text Blocks',
      pl: 'Bloki tekstu',
      ru: 'Текстовые блоки',
      uk: 'Текстові блоки',
    },
  },
  fields: [
    {
      name: 'content',
      label: {
        en: 'Content',
        pl: 'Zawartość',
        ru: 'Содержание',
        uk: 'Зміст',
      },
      type: 'richText',
      required: true,
    },
  ],
};
