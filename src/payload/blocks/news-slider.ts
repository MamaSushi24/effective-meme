import { Block } from 'payload/types';
const NewsSliderBlock: Block = {
  slug: 'news-slider-block', // required
  labels: {
    plural: {
      ru: 'Слайдер новостей',
      en: 'News slider',
      uk: 'Слайдер новин',
      pl: 'Slider aktualności',
    },
    singular: {
      ru: 'Слайдер новостей',
      en: 'News slider',
      uk: 'Слайдер новин',
      pl: 'Slider aktualności',
    },
  },
  imageURL: '/assets/dashboard/news-slider-block-preview.jpg', // optional
  fields: [
    {
      name: 'showLastNews',
      label: {
        en: 'Show last news',
        pl: 'Pokaż ostatnie aktualności',
        uk: 'Показати останні новини',
        ru: 'Показать последние новости',
      },
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      type: 'relationship',
      name: 'news',
      relationTo: 'news',
      hasMany: true,
      minRows: 1,
      admin: {
        condition: (_, siblingData) => !siblingData?.showLastNews,
      },
      hooks: {
        afterRead: [
          async ({ data, req, value, siblingData }) => {
            const showLastNews = siblingData?.showLastNews;
            if (showLastNews) {
              const news = await req.payload.find({
                collection: 'news',
                limit: 5,
                sort: '-date',
                locale: req.locale,
              });
              return [...news.docs];
            }
            return value;
          },
        ],
      },
    },
  ],
};
export default NewsSliderBlock;
