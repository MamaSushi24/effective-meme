import payload from 'payload';
import { Block } from 'payload/types';
const GroupPresentationBlock: Block = {
  slug: 'group-presentation-block', // required
  imageURL: '/assets/dashboard/group-presentation-block-preview.jpg', // optional
  fields: [
    // Grouo ID
    {
      type: 'relationship',
      name: 'group',
      relationTo: 'groups',
      required: true,
    },

    // Products
    {
      type: 'relationship',
      name: 'products',
      relationTo: 'products',
      hasMany: true,
      minRows: 1,
      validate: ({ value, req }) => true,
      filterOptions: async ({ siblingData }: any) => {
        const groupID =
          typeof siblingData?.group === 'string'
            ? siblingData?.group
            : siblingData?.group?.id;
        const subGroupIDs = await payload
          .find<'groups'>({
            collection: 'groups',
            where: {
              parentGroup: {
                equals: groupID,
              },
            },
          })
          .then(res => res.docs.map(doc => doc.id));

        return {
          parentGroup: {
            in: [groupID, ...subGroupIDs],
          },
        };
      },
    },

    // Header background image
    {
      name: 'headerBackgroundImage',
      label: {
        en: 'Header BG image',
        pl: 'Zdjęcie tła nagłówka',
        ru: 'Фоновое изображение заголовка',
        uk: 'Фонове зображення заголовка',
      },
      type: 'group',
      fields: [
        {
          name: 'desktop',
          label: {
            en: 'Desktop',
            pl: 'Komputer',
            ru: 'Компьютер',
            uk: "Комп'ютер",
          },
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'mobile',
          label: {
            en: 'Mobile',
            pl: 'Telefon',
            ru: 'Телефон',
            uk: 'Телефон',
          },
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
};
export default GroupPresentationBlock;
