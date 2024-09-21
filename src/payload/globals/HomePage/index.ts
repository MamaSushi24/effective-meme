import { GlobalConfig } from 'payload/types';
import GroupPresentationBlock from '../../blocks/group-presentation-block';
import NewsSliderBlock from '../../blocks/news-slider';
import { admins } from '../../access/admins';
import { TextBlock } from '../../blocks/text-block';
const HomePage: GlobalConfig = {
  slug: 'home-page',
  fields: [
    {
      type: 'blocks',
      name: 'blocks',
      minRows: 1,
      blocks: [GroupPresentationBlock, NewsSliderBlock, TextBlock],
    },
  ],
  access: {
    read: () => true,
    update: admins,
  },
};

export default HomePage;
