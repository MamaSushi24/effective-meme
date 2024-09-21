import { DiscountsCode } from '@/types/payload-types';
import { admins } from '../access/admins';
import { CollectionConfig } from 'payload/types';

const DiscountsCodes: CollectionConfig = {
  slug: 'discounts-codes',
  labels: {
    singular: {
      en: 'Discount Code',
      pl: 'Kod rabatowy',
      uk: 'Знижка',
      ru: 'Скидка',
    },
    plural: {
      en: 'Discount Codes',
      pl: 'Kody rabatowe',
      uk: 'Знижки',
      ru: 'Скидки',
    },
  },
  fields: [
    // ID
    {
      name: 'id',
      type: 'text',
      required: true,
      index: true,
      unique: true,
      // admin: {
      //   hidden: true,
      // },
    },
    // Name
    {
      name: 'name',
      label: {
        en: 'Name',
        pl: 'Nazwa',
        uk: "Ім'я",
        ru: 'Имя',
      },
      type: 'text',
      required: true,
    },
    // Percentage
    {
      name: 'percent',
      label: {
        en: 'Percentage',
        pl: 'Procent',
        uk: 'Відсоток',
        ru: 'Процент',
      },
      type: 'number',
      required: true,
    },
    //   Code
    {
      name: 'code',
      label: {
        en: 'Code',
        pl: 'Kod',
        uk: 'Код',
        ru: 'Код',
      },
      type: 'text',
      unique: true,
      index: true,
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') return value.toLowerCase();
            return value;
          },
        ],
      },
    },
    // Internal
    {
      name: 'internal',
      label: {
        en: 'Internal',
        pl: 'Wewnętrzny',
        uk: 'Внутрішній',
        ru: 'Внутренний',
      },
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: false,
  admin: {
    hidden: true,
    useAsTitle: 'name',
    disableDuplicate: true,
  },
  endpoints: [
    {
      path: '/check/:code',
      method: 'get',
      handler: [
        async (req, res) => {
          const { code } = req.params;
          const { phone } = req.query;
          const loverCaseCode = code.toLowerCase().trim();
          try {
            const response = await req.payload

              .find<'discount-strategies'>({
                collection: 'discount-strategies',
                limit: 100,
              })
              .then(res =>
                res.docs.filter(
                  doc =>
                    typeof doc.discountCode === 'string' &&
                    doc.discountCode.toLowerCase().trim() === loverCaseCode
                )
              );
            if (response.length === 0) {
              return res.status(200).send({
                msg: 'Discount code not found',
                status: 'fail',
                error: 'not-found',
              });
            }
            const discountData = response[0];
            const { oneUsePerCustomerEnabled } = discountData;
            if (oneUsePerCustomerEnabled && phone) {
              const query = req.payload.db?.collections[
                'orders'
              ]?.countDocuments({
                'customer.phone': phone,
                discountStrategiesApplied: {
                  $elemMatch: {
                    $eq: discountData.id,
                  },
                },
              });
              const count = await query.exec();
              if (count > 0) {
                return res.status(200).send({
                  msg: 'Discount code already used',
                  status: 'fail',
                  error: 'already-used',
                });
              }
            }
            const discount: DiscountsCode = {
              id: discountData.id,
              code: discountData.discountCode as string,
              percent: 0,
              name: discountData.title as string,
            };
            return res.status(200).send({
              discount: {
                ...discount,
                code: loverCaseCode,
              },
              status: 'ok',
            });
          } catch (error) {
            req.payload.logger.error(
              `Error while checking discount code: ${code}`
            );
            req.payload.logger.error(error);
          }
        },
      ],
    },
  ],
  access: {
    read: admins,
    update: admins,
    create: admins,
    delete: admins,
  },
  graphQL: false,
};

export default DiscountsCodes;
