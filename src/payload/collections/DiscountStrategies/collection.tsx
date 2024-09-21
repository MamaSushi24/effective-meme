import { Select, useField } from 'payload/components/forms';
import { DiscountApplicationValueType } from '../../../modules/cart/DiscountApplication/IDiscountApplication';
import { DiscountMethod, DiscountType } from '../../../modules/cart/enums';
import { CollectionConfig } from 'payload/types';
import React, { ReactElement } from 'react';
import { getTranslation } from 'payload/dist/utilities/getTranslation';
import { useTranslation } from 'react-i18next';
import { DeliveryStrategyType } from '../../../modules/cart/types';
const BigLabel = (props: any): ReactElement | null => {
  const { htmlFor, label, required = false } = props;

  const { i18n } = useTranslation();

  if (label) {
    return (
      <h3>
        {getTranslation(label, i18n)}
        {required && <span className="required">*</span>}
      </h3>
    );
  }

  return null;
};

const DISCOUNT_COMBINATION_FLAGS_MAP: {
  [key in DiscountType]:
    | 'deliveryDiscountsEnabled'
    | 'productsDiscountsEnabled'
    | 'orderDiscountsEnabled';
} = {
  [DiscountType.AMOUNT_OFF_ORDER]: 'orderDiscountsEnabled',
  [DiscountType.AMOUNT_OFF_PRODUCTS]: 'productsDiscountsEnabled',
  [DiscountType.BUY_X_GET_Y]: 'productsDiscountsEnabled',
  [DiscountType.FREE_DELIVERY]: 'deliveryDiscountsEnabled',
};
const collectionConfig: CollectionConfig = {
  labels: {
    singular: {
      en: 'Discount',
      ru: 'Скидка',
      uk: 'Знижка',
      pl: 'Zniżka',
    },
    plural: {
      en: 'Discounts',
      ru: 'Скидки',
      uk: 'Знижки',
      pl: 'Zniżki',
    },
  },
  timestamps: false,
  slug: 'discount-strategies',
  fields: [
    //   Type
    {
      name: 'type',
      label: {
        en: 'Type',
        ru: 'Тип',
        uk: 'Тип',
        pl: 'Typ',
      },
      type: 'select',
      defaultValue: DiscountType.AMOUNT_OFF_ORDER,
      options: [
        {
          value: DiscountType.AMOUNT_OFF_ORDER,
          label: {
            en: 'Amount off order',
            ru: 'Скидка на заказ',
            uk: 'Знижка на замовлення',
            pl: 'Kwota z zamówienia',
          },
        },
        {
          value: DiscountType.AMOUNT_OFF_PRODUCTS,
          label: {
            en: 'Amount off products',
            ru: 'Скидка на товары',
            uk: 'Знижка на товари',
            pl: 'Kwota z produktów',
          },
        },
        {
          value: DiscountType.BUY_X_GET_Y,
          label: {
            en: 'Buy X get Y',
            ru: 'Купи X получи Y',
            uk: 'Купуй X отримай Y',
            pl: 'Kup X otrzymaj Y',
          },
        },
        {
          value: DiscountType.FREE_DELIVERY,
          label: {
            en: 'Free delivery',
            ru: 'Бесплатная доставка',
            uk: 'Безкоштовна доставка',
            pl: 'Darmowa dostawa',
          },
        },
      ],
      required: true,
    },

    //   Method
    {
      name: 'method',
      label: {
        en: 'Method',
        ru: 'Метод',
        uk: 'Метод',
        pl: 'Metoda',
      },
      type: 'radio',
      required: true,
      defaultValue: DiscountMethod.CODE,
      options: [
        {
          value: DiscountMethod.CODE,
          label: {
            en: 'Discount code',
            ru: 'Промокод',
            uk: 'Промокод',
            pl: 'Kod rabatowy',
          },
        },
        {
          value: DiscountMethod.AUTOMATIC,
          label: {
            en: 'Automatic discount',
            ru: 'Автоматическая скидка',
            uk: 'Автоматична знижка',
            pl: 'Automatyczna zniżka',
          },
        },
      ],
    },

    //  Code
    {
      name: 'discountCode',
      label: {
        en: 'Discount code',
        ru: 'Промокод',
        uk: 'Промокод',
        pl: 'Kod rabatowy',
      },
      type: 'text',

      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.method !== DiscountMethod.CODE) {
              return null;
            }
            return value;
          },
        ],
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData.method === DiscountMethod.CODE,
        description: {
          en: 'Customers must enter this code at checkout.',
          ru: 'Клиенты должны ввести этот код при оформлении заказа.',
          uk: 'Клієнти повинні ввести цей код при оформленні замовлення.',
          pl: 'Klienci muszą wprowadzić ten kod przy kasie.',
        },
      },
    },

    // Title
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Title',
        ru: 'Название',
        uk: 'Назва',
        pl: 'Nazwa',
      },
      localized: true,
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (siblingData.method === DiscountMethod.CODE) {
              return siblingData.discountCode;
            }
            return value;
          },
        ],
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData.method === DiscountMethod.AUTOMATIC,
        description: {
          en: 'Customers will see this in their cart and at checkout.',
          ru: 'Клиенты увидят это в своей корзине и при оформлении заказа.',
          uk: 'Клієнти побачать це в своїй кошику і при оформленні замовлення.',
          pl: 'Klienci zobaczą to w swoim koszyku i przy kasie.',
        },
      },
    },

    // Discount value
    {
      name: 'discountValue',
      label: {
        en: 'Discount value',
        ru: 'Скидка',
        uk: 'Знижка',
        pl: 'Zniżka',
      },
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            // Discount value type
            {
              name: 'discountValueType',
              type: 'select',
              options: [
                {
                  value: DiscountApplicationValueType.PERCENTAGE,
                  label: {
                    en: 'Percentage',
                    ru: 'Процент',
                    uk: 'Відсоток',
                    pl: 'Procent',
                  },
                },
                {
                  value: DiscountApplicationValueType.FIXED_AMOUNT,
                  label: {
                    en: 'Fixed amount',
                    ru: 'Фиксированная сумма',
                    uk: 'Фіксована сума',
                    pl: 'Stała kwota',
                  },
                },
              ],
            },

            // Discount value
            {
              name: 'discountValue',
              type: 'number',
            },
          ],
        },

        // Applies to type
        {
          name: 'appliesToType',
          label: {
            en: 'Applies to',
            ru: 'Применяется к',
            uk: 'Застосовується до',
            pl: 'Dotyczy',
          },
          type: 'select',
          options: [
            {
              value: 'PRODUCTS',
              label: {
                en: 'Specific products',
                ru: 'Конкретные продукты',
                uk: 'Специфічні продукти',
                pl: 'Konkretne produkty',
              },
            },
            {
              value: 'COLLECTIONS',
              label: {
                en: 'Specific collections',
                ru: 'Конкретные коллекции',
                uk: 'Специфічні колекції',
                pl: 'Konkretne kolekcje',
              },
            },
          ],

          admin: {
            condition: data => data?.type === DiscountType.AMOUNT_OFF_PRODUCTS,
          },
        },
        // Applies to
        {
          name: 'appliesTo',
          type: 'relationship',
          relationTo: ['products', 'groups'],
          hasMany: true,
          filterOptions: ({ relationTo, siblingData }) => {
            // @ts-expect-error
            const appliesToType = siblingData?.appliesToType;
            if (appliesToType === 'COLLECTIONS') {
              if (relationTo === 'groups') {
                return { and: [] };
              }
              if (relationTo === 'products') {
                return {
                  and: [{ id: { exists: false } }],
                };
              }
            }
            if (appliesToType === 'PRODUCTS') {
              if (relationTo === 'products') {
                return { and: [] };
              }
              if (relationTo === 'groups') {
                return {
                  and: [{ id: { exists: false } }],
                };
              }
            }
            return {
              and: [],
            };
          },
          admin: {
            components: {
              Label: () => null,
            },
            condition: data => data?.type === DiscountType.AMOUNT_OFF_PRODUCTS,
          },
        },
        // Only applies once per order
        {
          name: 'onlyAppliesOncePerOrder',
          type: 'checkbox',
          label: {
            en: 'Only applies once per order',
            ru: 'Применяется только один раз на заказ',
            uk: 'Застосовується тільки один раз на замовлення',
            pl: 'Dotyczy tylko raz na zamówienie',
          },
          admin: {
            condition: (data, siblingData) =>
              data?.type === DiscountType.AMOUNT_OFF_PRODUCTS &&
              siblingData.discountValueType ===
                DiscountApplicationValueType.FIXED_AMOUNT,
          },
        },
      ],

      admin: {
        condition: (_, siblingData) => {
          switch (siblingData?.type) {
            case DiscountType.AMOUNT_OFF_ORDER:
            case DiscountType.AMOUNT_OFF_PRODUCTS:
              return true;
            default:
              return false;
          }
        },
      },
    },

    // Minimum purchase requirements
    {
      name: 'minimumPurchaseRequirements',
      type: 'radio',
      label: {
        en: 'Minimum purchase requirements',
        ru: 'Минимальные требования к покупке',
        uk: 'Мінімальні вимоги до покупки',
        pl: 'Minimalne wymagania dotyczące zakupu',
      },
      options: [
        {
          value: 'NONE',
          label: {
            en: 'No minimum requirements',
            ru: 'Нет минимальных требований',
            uk: 'Немає мінімальних вимог',
            pl: 'Brak minimalnych wymagań',
          },
        },
        {
          value: 'AMOUNT',
          label: {
            en: 'Minimum purchase amount',
            ru: 'Минимальная сумма покупки',
            uk: 'Мінімальна сума покупки',
            pl: 'Minimalna kwota zakupu',
          },
        },
        {
          value: 'QUANTITY',
          label: {
            en: 'Minimum quantity of items',
            ru: 'Минимальное количество товаров',
            uk: 'Мінімальна кількість товарів',
            pl: 'Minimalna ilość przedmiotów',
          },
        },
      ],
      admin: {
        components: {
          Label: BigLabel,
        },
        layout: 'vertical',
        condition: (_, siblingData) => {
          switch (siblingData?.type) {
            case DiscountType.AMOUNT_OFF_ORDER:
            case DiscountType.AMOUNT_OFF_PRODUCTS:
            case DiscountType.FREE_DELIVERY:
              return true;
            default:
              return false;
          }
        },
      },
    },

    // Minimum Purchase Requirements Value
    {
      name: 'minimumPurchaseRequirementsValue',
      type: 'number',
      admin: {
        width: '15%',
        components: {
          Label: () => null,
        },
        condition: (data, siblingData) => {
          switch (data?.type) {
            case DiscountType.AMOUNT_OFF_ORDER:
            case DiscountType.AMOUNT_OFF_PRODUCTS:
            case DiscountType.FREE_DELIVERY:
              break;
            default:
              return false;
          }
          if (data?.minimumPurchaseRequirements !== 'NONE') return true;
          return false;
        },
      },
    },

    // Delivery Type
    {
      name: 'deliveryType',
      label: {
        en: 'Delivery type',
        ru: 'Тип доставки',
        uk: 'Тип доставки',
        pl: 'Typ dostawy',
      },
      type: 'select',
      options: [
        {
          value: DeliveryStrategyType.PICKUP,
          label: {
            en: 'Pickup',
            ru: 'Самовывоз',
            uk: 'Самовивіз',
            pl: 'Odbiór osobisty',
          },
        },
        {
          value: DeliveryStrategyType.DELIVERY_BY_COURIER,
          label: {
            en: 'Delivery by courier',
            ru: 'Доставка курьером',
            uk: "Доставка кур'єром",
            pl: 'Dostawa kurierem',
          },
        },
      ],
      admin: {
        isClearable: true,
        condition: (_, siblingData) =>
          siblingData?.type !== DiscountType.FREE_DELIVERY,

        components: {
          Label: BigLabel,
        },
      },
    },

    // Customer buys X
    {
      name: 'customerBuysX',
      type: 'group',
      label: {
        en: 'Customer buys X',
        ru: 'Клиент покупает X',
        uk: 'Клієнт купує X',
        pl: 'Klient kupuje X',
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === DiscountType.BUY_X_GET_Y,
      },
      fields: [
        // XType
        {
          name: 'xType',
          type: 'radio',
          admin: {
            components: {
              Label: () => null,
            },
          },
          options: [
            {
              value: 'totalQuantity',
              label: {
                en: 'Total quantity',
                ru: 'Общее количество',
                uk: 'Загальна кількість',
                pl: 'Całkowita ilość',
              },
            },
            {
              value: 'totalPrice',
              label: {
                en: 'Total price',
                ru: 'Общая цена',
                uk: 'Загальна ціна',
                pl: 'Całkowita cena',
              },
            },
            {
              value: 'totalQuantityOfSpecificProducts',
              label: {
                en: 'Total quantity of specific products',
                ru: 'Общее количество определенных товаров',
                uk: 'Загальна кількість певних товарів',
                pl: 'Całkowita ilość określonych produktów',
              },
            },
            {
              value: 'totalPriceOfSpecificProducts',
              label: {
                en: 'Total price of specific products',
                ru: 'Общая цена определенных товаров',
                uk: 'Загальна ціна певних товарів',
                pl: 'Całkowita cena określonych produktów',
              },
            },
          ],
        },

        // XValue
        {
          name: 'xValue',
          type: 'number',
          admin: {
            components: {
              Label: () => null,
            },
          },
        },

        // XProducts
        {
          name: 'xProducts',
          label: {
            en: 'Any items from',
            ru: 'Любые товары из',
            uk: 'Будь-які товари з',
            pl: 'Dowolne przedmioty z',
          },
          type: 'relationship',
          relationTo: ['products'],
          hasMany: true,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.xType === 'totalQuantityOfSpecificProducts' ||
              siblingData?.xType === 'totalPriceOfSpecificProducts',
            components: {},
          },
        },
      ],
    },

    // Customer gets Y
    {
      name: 'customerGetsY',
      type: 'group',
      label: {
        en: 'Customer gets Y',
        ru: 'Клиент получает Y',
        uk: 'Клієнт отримує Y',
        pl: 'Klient otrzymuje Y',
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData?.type === DiscountType.BUY_X_GET_Y,
      },
      fields: [
        // Quantity
        {
          name: 'quantity',
          label: {
            en: 'Quantity',
            ru: 'Количество',
            uk: 'Кількість',
            pl: 'Ilość',
          },

          type: 'number',
        },

        // X Product
        {
          name: 'yProduct',
          label: {
            en: 'Y product',
            ru: 'Y продукт',
            uk: 'Y продукт',
            pl: 'Y produkt',
          },
          type: 'relationship',
          relationTo: 'products',

          admin: {
            components: {
              Label: () => null,
            },
          },
        },

        // At a discounted value
        {
          name: 'atDiscountedValue',
          label: {
            en: 'At a discounted value',
            ru: 'По сниженной цене',
            uk: 'Зі зниженою ціною',
            pl: 'W obniżonej cenie',
          },
          type: 'radio',
          options: [
            {
              value: 'PERCENTAGE',
              label: {
                en: 'Percentage',
                ru: 'Процент',
                uk: 'Відсоток',
                pl: 'Procent',
              },
            },
            {
              value: 'FREE',
              label: {
                en: 'Free',
                ru: 'Бесплатно',
                uk: 'Безкоштовно',
                pl: 'Darmowe',
              },
            },
          ],
        },

        // At a discounted value
        {
          name: 'discountedValue',
          type: 'number',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.atDiscountedValue !== 'FREE',
            components: {
              Label: () => null,
            },
          },
        },
      ],
    },

    // Used
    {
      name: 'used',
      type: 'number',
      label: {
        en: 'Used',
        ru: 'Использован',
        uk: 'Використаний',
        pl: 'Używany',
      },
      admin: {
        components: {
          Field: () => null,
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData['used'];
            return undefined;
          },
        ],
        afterRead: [
          async ({ req, data }) => {
            if (!data?.id) return 0;
            const discountID = data?.id;
            const query = req?.payload?.db?.collections[
              'orders'
            ]?.countDocuments({
              discountStrategiesApplied: {
                $elemMatch: {
                  $eq: discountID,
                },
              },
            });
            const res = await query.exec();

            return res ?? 0;
          },
        ],
      },
    },

    // Maximum number of uses
    // {
    //   name: 'maximumUses',
    //   type: 'group',
    //   label: {
    //     en: 'Maximum discount uses',
    //     ru: 'Максимальное количество использований скидки',
    //     uk: 'Максимальна кількість використань знижки',
    //     pl: 'Maksymalna liczba użyć rabatu',
    //   },
    //   fields: [
    //     // Maximum number of uses
    //     {
    //       name: 'totalUsesEnabled',
    //       type: 'checkbox',
    //       label: {
    //         en: 'Limit number of times this discount can be used in total',
    //         ru: 'Ограничить количество использований этой скидки в общей сложности',
    //         uk: 'Обмежити кількість використань цієї знижки в загальній складності',
    //         pl: 'Ogranicz liczbę razy, gdy ten rabat może być używany łącznie',
    //       },
    //     },
    //     {
    //       name: 'totalUses',
    //       type: 'number',
    //       admin: {
    //         components: {
    //           Label: () => null,
    //         },
    //         condition: (_, siblingData) =>
    //           siblingData?.totalUsesAllowedEnabled === true,
    //         width: '10%',
    //       },
    //     },
    // Per customer

    //     {
    //       name: 'perCustomer',
    //       type: 'number',
    //       admin: {
    //         components: {
    //           Label: () => null,
    //         },
    //         width: '10%',
    //         condition: (_, siblingData) =>
    //           siblingData?.perCustomerEnabled === true,
    //       },
    //     },
    //   ],
    // },
    // Combinations
    // {
    //   name: 'combinations',
    //   type: 'group',
    //   label: {
    //     en: 'Combinations',
    //     ru: 'Комбинации',
    //     uk: 'Комбінації',
    //     pl: 'Kombinacje',
    //   },
    //   admin: {
    //     description: {
    //       en: 'Can be combined with:',
    //       ru: 'Может быть объединено с:',
    //       uk: "Може бути об'єднано з:",
    //       pl: 'Może być połączony z:',
    //     },
    //   },
    //   fields: [
    //     // Delivery discount strategies
    //     {
    //       name: 'deliveryDiscountsEnabled',
    //       type: 'checkbox',
    //       label: {
    //         en: 'Delivery discount strategies',
    //         ru: 'Стратегии скидок на доставку',
    //         uk: 'Стратегії знижок на доставку',
    //         pl: 'Strategie rabatów na dostawę',
    //       },
    //       admin: {
    //         condition: (data, siblingData) =>
    //           data?.type !== DiscountType.FREE_DELIVERY,
    //       },
    //     },
    //     {
    //       name: 'deliveryDiscounts',
    //       type: 'relationship',
    //       relationTo: 'discount-strategies',
    //       hooks: {
    //         afterRead: [
    //           async ({ req, siblingData, data }) => {
    //             if (data?.type === DiscountType.FREE_DELIVERY) return [];
    //             if (!siblingData?.deliveryDiscountsEnabled) return [];

    //             const currentType = data?.type as DiscountType;
    //             const combitationPath = `combinations.${DISCOUNT_COMBINATION_FLAGS_MAP[currentType]}`;
    //             const query = req?.payload?.db?.collections[
    //               'discount-strategies'
    //             ]?.find({
    //               _id: {
    //                 $ne: data?.id,
    //               },
    //               type: DiscountType.FREE_DELIVERY,
    //               [combitationPath]: true,
    //             });
    //             const res = await query
    //               .exec()
    //               .then(res => res.map(item => item._id));
    //             return res ?? [];
    //           },
    //         ],
    //       },
    //       hasMany: true,
    //       admin: {
    //         condition: (_, siblingData) =>
    //           siblingData?.deliveryDiscountsEnabled === true,
    //         readOnly: true,
    //         components: {
    //           Label: () => null,
    //         },
    //       },
    //     },

    //     // Order discount strategies
    //     {
    //       name: 'orderDiscountsEnabled',
    //       type: 'checkbox',
    //       label: {
    //         en: 'Order discount strategies',
    //         ru: 'Стратегии скидок на заказ',
    //         uk: 'Стратегії знижок на замовлення',
    //         pl: 'Strategie rabatów na zamówienie',
    //       },
    //       admin: {
    //         condition: (_, siblingData) =>
    //           siblingData?.type !== DiscountType.AMOUNT_OFF_ORDER,
    //       },
    //     },
    //     {
    //       name: 'orderDiscounts',
    //       type: 'relationship',
    //       relationTo: 'discount-strategies',
    //       filterOptions: ({ data }) => {
    //         const currentType = data?.type as DiscountType;
    //         const currentDiscountID = data?.id as string;
    //         const combitationPath = `combinations.${DISCOUNT_COMBINATION_FLAGS_MAP[currentType]}`;

    //         if (!currentType || !currentDiscountID)
    //           return {
    //             type: {
    //               equals: DiscountType.AMOUNT_OFF_ORDER,
    //             },
    //           };

    //         return {
    //           type: {
    //             equals: DiscountType.AMOUNT_OFF_ORDER,
    //           },
    //           [combitationPath]: {
    //             exists: true,
    //           },
    //         };
    //       },
    //       hooks: {
    //         afterRead: [
    //           async ({ req, siblingData, data, value }) => {
    //             if (!siblingData?.orderDiscountsEnabled) return [];
    //             const currentType = data?.type as DiscountType;
    //             const currentDiscountID = data?.id;
    //             const combitationPath = `combinations.${DISCOUNT_COMBINATION_FLAGS_MAP[currentType]}`;

    //             // If current discount is delivery discount - return all order discounts that have delivery discount enabled
    //             if (currentType === DiscountType.FREE_DELIVERY) {
    //               const query = req?.payload?.db?.collections[
    //                 'discount-strategies'
    //               ]?.find({
    //                 _id: {
    //                   $ne: data?.id,
    //                 },
    //                 type: DiscountType.AMOUNT_OFF_ORDER,
    //                 [combitationPath]: true,
    //               });
    //               const res = await query
    //                 .exec()
    //                 .then(res => res.map(item => item._id));
    //               return res;
    //             }
    //             const query = req?.payload?.db?.collections[
    //               'discount-strategies'
    //             ]?.find({
    //               _id: {
    //                 $ne: data?.id,
    //               },
    //               type: DiscountType.AMOUNT_OFF_ORDER,
    //               [combitationPath]: true,
    //               orderDiscounts: {
    //                 $elemMatch: {
    //                   $eq: currentDiscountID,
    //                 },
    //               },
    //             });
    //             const res = await query
    //               .exec()
    //               .then(res => res.map(item => item._id));
    //             if (value) {
    //               return [...value, ...res];
    //             }
    //             return res ?? [];
    //           },
    //         ],
    //       },
    //       hasMany: true,
    //       admin: {
    //         condition: (_, siblingData) =>
    //           siblingData?.orderDiscountsEnabled === true,
    //       },
    //     },

    //     // Products discount strategies
    //     {
    //       name: 'productsDiscountsEnabled',
    //       type: 'checkbox',
    //       label: {
    //         en: 'Products discount strategies',
    //         ru: 'Стратегии скидок на товары',
    //         uk: 'Стратегії знижок на товари',
    //         pl: 'Strategie rabatów na produkty',
    //       },
    //     },
    //     {
    //       name: 'productsDiscounts',
    //       type: 'relationship',
    //       relationTo: 'discount-strategies',
    //       filterOptions: ({ data }) => {
    //         const currentType = data?.type as DiscountType;
    //         const currentDiscountID = data?.id as string;
    //         const combitationPath = `combinations.${DISCOUNT_COMBINATION_FLAGS_MAP[currentType]}`;
    //         if (!currentType || !currentDiscountID)
    //           return {
    //             type: {
    //               equals: DiscountType.AMOUNT_OFF_PRODUCTS,
    //             },
    //           };
    //         return {
    //           type: {
    //             equals: DiscountType.AMOUNT_OFF_PRODUCTS,
    //           },
    //           [combitationPath]: {
    //             exists: true,
    //           },
    //         };
    //       },
    //       hooks: {
    //         afterRead: [
    //           async ({ req, siblingData, data, value }) => {
    //             if (!siblingData?.productsDiscountsEnabled) return [];
    //             const currentType = data?.type as DiscountType;
    //             const currentDiscountID = data?.id;
    //             const combitationPath = `combinations.${DISCOUNT_COMBINATION_FLAGS_MAP[currentType]}`;

    //             // If current discount is delivery discount - return all products discounts that have delivery discount enabled
    //             if (currentType === DiscountType.FREE_DELIVERY) {
    //               const query = req?.payload?.db?.collections[
    //                 'discount-strategies'
    //               ]?.find({
    //                 _id: {
    //                   $ne: data?.id,
    //                 },
    //                 type: {
    //                   $in: [
    //                     DiscountType.AMOUNT_OFF_PRODUCTS,
    //                     DiscountType.BUY_X_GET_Y,
    //                   ],
    //                 },
    //                 [combitationPath]: true,
    //               });
    //               const res = await query
    //                 .exec()
    //                 .then(res => res.map(item => item._id));
    //               return res;
    //             }
    //             const query = req?.payload?.db?.collections[
    //               'discount-strategies'
    //             ]?.find({
    //               _id: {
    //                 $ne: data?.id,
    //               },
    //               type: {
    //                 $in: [
    //                   DiscountType.AMOUNT_OFF_PRODUCTS,
    //                   DiscountType.BUY_X_GET_Y,
    //                 ],
    //               },
    //               [combitationPath]: true,
    //               productsDiscounts: {
    //                 $elemMatch: {
    //                   $eq: currentDiscountID,
    //                 },
    //               },
    //             });
    //             const res = await query
    //               .exec()
    //               .then(res => res.map(item => item._id));
    //             if (value) {
    //               return [...value, ...res];
    //             }
    //             return res ?? [];
    //           },
    //         ],
    //       },
    //       admin: {
    //         condition: (_, siblingData) =>
    //           siblingData?.productsDiscountsEnabled === true,
    //       },
    //     },
    //   ],
    // },

    // // Combinations
    {
      name: 'combinations',
      label: {
        en: 'Combinations',
        ru: 'Комбинации',
        uk: 'Комбінації',
        pl: 'Kombinacje',
      },

      type: 'relationship',
      relationTo: 'discount-strategies',
      hasMany: true,
      maxDepth: 0,
    },

    // One use per customer
    {
      name: 'oneUsePerCustomerEnabled',
      type: 'checkbox',
      label: {
        en: 'Limit to one use per customer',
        ru: 'Ограничить одним использованием на клиента',
        uk: 'Обмежити одним використанням на клієнта',
        pl: 'Ogranicz do jednego użycia na klienta',
      },
      defaultValue: false,
    },
    // Active
    {
      name: 'active',
      type: 'checkbox',
      label: {
        en: 'Active',
        ru: 'Активный',
        uk: 'Активний',
        pl: 'Aktywny',
      },
      defaultValue: true,
    },
  ],

  admin: {
    defaultColumns: ['title', 'type', 'method', 'active', 'used'],
    useAsTitle: 'title',
    listSearchableFields: [
      'title',
      'discountCode',
      'type',
      'method',
      'active',
      'used',
    ],
  },
};
export default collectionConfig;
