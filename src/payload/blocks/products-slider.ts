import { Block } from 'payload/types';
const ProductsSliderBlock: Block = {
  slug: 'products-slider-block', // required
  imageURL: '/assets/dashboard/news-slider-block-preview.jpg', // optional
  fields: [
    {
      type: 'text',
      name: 'title',
      localized: true,
      required: true,
      label: {
        en: 'Title',
        pl: 'Tytuł',
        ru: 'Заголовок',
        uk: 'Заголовок',
      },
      admin: {
        description: {
          en: 'Localized title of the block',
          pl: 'Tytuł bloku w różnych językach',
          ru: 'Локализованное название блока',
          uk: 'Локалізоване назва блоку',
        },
      },
    },
    {
      type: 'relationship',
      name: 'products',
      relationTo: 'products',
      required: true,
      hasMany: true,
      minRows: 1,
      label: {
        en: 'Products',
        pl: 'Produkty',
        ru: 'Товары',
        uk: 'Товари',
      },
    },
  ],
};
export default ProductsSliderBlock;
