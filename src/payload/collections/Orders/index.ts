import { CollectionConfig } from 'payload/types';
import { admins } from '../../access/admins';
import checkoutEndpoint from './endpoints/checkout';
import payuEndpoint from './endpoints/payu';
import sendOrderToSyrve from './hooks/sendOrderToSyrve';
const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    plural: {
      en: 'Orders',
      pl: 'Zamówienia',
      uk: 'Замовлення',
      ru: 'Заказы',
    },
    singular: {
      en: 'Order',
      pl: 'Zamówienie',
      uk: 'Замовлення',
      ru: 'Заказ',
    },
  },

  fields: [
    //Order ID
    {
      name: 'orderId',
      type: 'text',
      label: {
        en: 'Order ID',
        pl: 'ID zamówienia',
        uk: 'ID замовлення',
        ru: 'ID заказа',
      },
      hooks: {
        beforeValidate: [
          ({ operation, value }) => {
            if (operation === 'create') {
              // Generate random 7 digit number
              return Math.floor(1000000 + Math.random() * 9000000).toString();
              // return value;
            }
            return value;
          },
        ],
      },
      admin: {
        readOnly: true,
      },
    },
    // Customer
    {
      name: 'customer',
      label: {
        en: 'Customer',
        pl: 'Klient',
        uk: 'Клієнт',
        ru: 'Клиент',
      },
      type: 'group',
      fields: [
        // Name
        {
          name: 'name',
          type: 'text',
          label: {
            en: 'Name',
            pl: 'Imię',
            uk: "Ім'я",
            ru: 'Имя',
          },
          required: true,
          admin: {
            readOnly: true,
          },
        },

        // Phone
        {
          name: 'phone',
          type: 'text',
          label: {
            en: 'Phone',
            pl: 'Telefon',
            uk: 'Телефон',
            ru: 'Телефон',
          },
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
      admin: {
        readOnly: true,
      },
    },

    //Delivery
    {
      type: 'group',
      name: 'delivery',
      label: {
        en: 'Delivery',
        pl: 'Dostawa',
        uk: 'Доставка',
        ru: 'Доставка',
      },
      fields: [
        // Delivery type
        {
          name: 'type',
          type: 'select',
          required: true,
          label: {
            en: 'Delivery',
            pl: 'Dostawa',
            uk: 'Доставка',
            ru: 'Доставка',
          },
          options: [
            {
              label: {
                en: 'Self',
                pl: 'Odbiór osobisty',
                uk: 'Самовивіз',
                ru: 'Самовывоз',
              },
              value: 'self',
            },
            {
              label: {
                en: 'Delivery',
                pl: 'Dostawa',
                uk: 'Доставка',
                ru: 'Доставка',
              },
              value: 'delivery',
            },
          ],
          admin: {
            readOnly: true,
          },
        },
        //Street
        {
          name: 'street',
          type: 'text',
          label: {
            en: 'Street',
            pl: 'Ulica',
            uk: 'Вулиця',
            ru: 'Улица',
          },
          admin: {
            readOnly: true,
          },
        },
        // StreetName
        {
          name: 'streetName',
          type: 'text',
          label: {
            en: 'Street Name',
            pl: 'Nazwa ulicy',
            uk: 'Назва вулиці',
            ru: 'Название улицы',
          },
          admin: {
            readOnly: true,
          },
        },
        // StreetId
        {
          name: 'streetId',
          type: 'text',
          label: {
            en: 'Street ID',
            pl: 'ID ulicy',
            uk: 'ID вулиці',
            ru: 'ID улицы',
          },
          admin: {
            readOnly: true,
          },
        },
        // Postcode
        {
          name: 'postcode',
          type: 'text',
          label: {
            en: 'Postcode',
            pl: 'Kod pocztowy',
            uk: 'Поштовий індекс',
            ru: 'Почтовый индекс',
          },
          admin: {
            readOnly: true,
          },
        },
        // House
        {
          name: 'house',
          type: 'text',
          label: {
            en: 'House',
            pl: 'Dom',
            uk: 'Дім',
            ru: 'Дом',
          },
          admin: {
            readOnly: true,
          },
        },

        //Flat
        {
          name: 'flat',
          type: 'text',
          label: {
            en: 'Flat',
            pl: 'Mieszkanie',
            uk: 'Квартира',
            ru: 'Квартира',
          },
          admin: {
            readOnly: true,
          },
        },

        // Floor
        {
          name: 'floor',
          type: 'text',
          label: {
            en: 'Floor',
            pl: 'Piętro',
            uk: 'Поверх',
            ru: 'Этаж',
          },
          admin: {
            readOnly: true,
          },
        },

        // Date
        {
          name: 'date',
          type: 'text',
          label: {
            en: 'Date to deliver',
            pl: 'Data dostawy',
            uk: 'Дата доставки',
            ru: 'Дата доставки',
          },
          admin: {
            readOnly: true,
          },
        },

        // Time
        {
          name: 'time',
          type: 'text',
          label: {
            en: 'Time to deliver',
            pl: 'Czas dostawy',
            uk: 'Час доставки',
            ru: 'Время доставки',
          },
          admin: {
            readOnly: true,
          },
        },
      ],
      admin: {
        readOnly: true,
      },
    },

    // Payments
    {
      name: 'payment',
      label: {
        en: 'Payment',
        pl: 'Płatność',
        uk: 'Оплата',
        ru: 'Оплата',
      },
      type: 'group',
      fields: [
        // Type
        {
          name: 'type',
          type: 'select',
          label: {
            en: 'Payment',
            pl: 'Płatność',
            uk: 'Оплата',
            ru: 'Оплата',
          },
          required: true,
          options: [
            {
              label: {
                en: 'Cash',
                pl: 'Gotówka',
                uk: 'Готівка',
                ru: 'Наличные',
              },
              value: 'cash',
            },
            {
              label: {
                en: 'Terminal',
                pl: 'Terminal',
                uk: 'Термінал',
                ru: 'Терминал',
              },
              value: 'terminal',
            },
            {
              label: {
                en: 'Online',
                pl: 'Online',
                uk: 'Онлайн',
                ru: 'Онлайн',
              },
              value: 'online',
            },
          ],
          admin: {
            readOnly: true,
          },
        },
        // Status
        {
          name: 'status',
          type: 'select',
          label: {
            en: 'Status',
            pl: 'Status',
            uk: 'Статус',
            ru: 'Статус',
          },
          required: true,
          options: [
            {
              label: {
                en: 'Pending',
                pl: 'Oczekujące',
                uk: 'В очікуванні',
                ru: 'В ожидании',
              },
              value: 'pending',
            },
            {
              label: {
                en: 'Paid',
                pl: 'Opłacone',
                uk: 'Оплачено',
                ru: 'Оплачено',
              },
              value: 'paid',
            },
            {
              label: {
                en: 'Canceled',
                pl: 'Anulowane',
                uk: 'Скасовано',
                ru: 'Отменено',
              },
              value: 'canceled',
            },
          ],
        },
        // Link to payment
        {
          name: 'link',
          type: 'text',
          label: {
            en: 'Link to payment',
            pl: 'Link do płatności',
            uk: 'Посилання на оплату',
            ru: 'Ссылка на оплату',
          },
          admin: {
            readOnly: true,
          },
        },
        // Transaction Data
        {
          name: 'transactionData',
          type: 'text',
          label: {
            en: 'Transaction Data',
            pl: 'Dane transakcji',
            uk: 'Дані транзакції',
            ru: 'Данные транзакции',
          },
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Comment
    {
      name: 'comment',
      type: 'textarea',
      label: {
        en: 'Comment',
        pl: 'Komentarz',
        uk: 'Коментар',
        ru: 'Комментарий',
      },
      admin: {
        readOnly: true,
      },
    },

    // Cart
    {
      name: 'cartLines',
      label: {
        en: 'Cart Items',
        pl: 'Produkty',
        uk: 'Продукти',
        ru: 'Продукты',
      },
      required: true,
      type: 'array',
      minRows: 1,
      fields: [
        // Product
        {
          name: 'product',
          label: {
            en: 'Product',
            pl: 'Produkt',
            uk: 'Продукт',
            ru: 'Продукт',
          },
          type: 'relationship',
          relationTo: 'products',
          hasMany: false,
          required: true,
        },
        // Quantity
        {
          name: 'quantity',
          label: {
            en: 'Quantity',
            pl: 'Ilość',
            uk: 'Кількість',
            ru: 'Количество',
          },
          type: 'number',
          required: true,
        },
        // Price
        {
          name: 'price',
          label: {
            en: 'Price',
            pl: 'Cena',
            uk: 'Ціна',
            ru: 'Цена',
          },
          type: 'number',
          required: true,
        },
      ],
      admin: {
        readOnly: true,
        initCollapsed: true,
      },
    },

    // Guests count
    {
      name: 'guestsCount',
      type: 'number',
      label: {
        en: 'Guests Count',
        pl: 'Liczba gości',
        uk: 'Кількість гостей',
        ru: 'Количество гостей',
      },
      required: true,
    },

    // Discount
    {
      name: 'discountMoney',
      type: 'number',
      label: {
        en: 'Discount',
        pl: 'Zniżka',
        uk: 'Знижка',
        ru: 'Скидка',
      },
      required: true,
      admin: {
        readOnly: true,
      },
    },

    // Discount code
    {
      name: 'discountCode',
      type: 'text',
      label: {
        en: 'Discount Code',
        pl: 'Kod rabatowy',
        uk: 'Код знижки',
        ru: 'Код скидки',
      },
      admin: {
        readOnly: true,
      },
    },

    // DiscountID
    {
      name: 'discountID',
      type: 'text',
      label: {
        en: 'Discount ID',
        pl: 'ID rabatu',
        uk: 'ID знижки',
        ru: 'ID скидки',
      },
      admin: {
        readOnly: true,
      },
    },

    // Discount Percent
    {
      name: 'discountPercent',
      type: 'number',
      label: {
        en: 'Discount Percent',
        pl: 'Procent zniżki',
        uk: 'Процент знижки',
        ru: 'Процент скидки',
      },
      required: true,
    },
    // Cart price
    {
      name: 'cartPrice',
      type: 'number',
      label: {
        en: 'Cart Price',
        pl: 'Cena zamówienia',
        uk: 'Ціна замовлення',
        ru: 'Цена заказа',
      },
      required: true,
      admin: {
        readOnly: true,
      },
    },
    // Cart price with discount
    {
      name: 'cartPriceWithDiscount',
      type: 'number',
      label: {
        en: 'Cart Price with Discount',
        pl: 'Cena zamówienia z zniżką',
        uk: 'Ціна замовлення зі знижкою',
        ru: 'Цена заказа со скидкой',
      },
      admin: {
        readOnly: true,
      },
      required: true,
    },
    // Delivery price
    {
      type: 'number',
      name: 'deliveryPrice',
      label: {
        en: 'Delivery Price',
        pl: 'Cena dostawy',
        uk: 'Ціна доставки',
        ru: 'Цена доставки',
      },
      required: true,
      admin: {
        readOnly: true,
      },
    },
    // DeliveryZone
    {
      name: 'deliveryZone',
      type: 'text',
      label: {
        en: 'Delivery Zone',
        pl: 'Strefa dostawy',
        uk: 'Зона доставки',
        ru: 'Зона доставки',
      },
      admin: {
        readOnly: true,
      },
    },
    // DeliveryZoneID
    {
      name: 'deliveryZoneID',
      type: 'text',
      label: {
        en: 'Delivery Zone ID',
        pl: 'ID strefy dostawy',
        uk: 'ID зони доставки',
        ru: 'ID зоны доставки',
      },
      admin: {
        readOnly: true,
      },
    },
    // Total with delivery
    {
      name: 'totalWithDelivery',
      type: 'number',
      label: {
        en: 'Total with Delivery',
        pl: 'Razem z dostawą',
        uk: 'Разом з доставкою',
        ru: 'Всего с доставкой',
      },
      admin: {
        readOnly: true,
      },
      required: true,
    },

    // PayU order id
    {
      name: 'payuOrderId',
      type: 'text',
    },

    // Discount strategies applied
    {
      name: 'discountStrategiesApplied',
      label: {
        en: 'Discount Strategies Applied',
        pl: 'Zastosowane strategie rabatowe',
        uk: 'Застосовані стратегії знижок',
        ru: 'Примененные стратегии скидок',
      },
      type: 'relationship',
      relationTo: 'discount-strategies',
      hasMany: true,
      admin: {
        // readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [sendOrderToSyrve],
  },
  endpoints: [
    checkoutEndpoint,
    payuEndpoint,
    {
      handler: async (req, res) => {
        const { id } = req.params;
        try {
          const order = await req.payload.findByID({
            collection: 'orders',
            id,
          });
          if (!order) {
            res.status(404).send('Order not found');
            req.payload.logger.info(
              `Tried to get order with id ${id}, when verify status but it was not found`
            );
          }
          const { status } = order.payment;
          return res.status(200).send({
            orderId: id,
            status,
            order: order,
            total: order.totalWithDelivery,
          });
        } catch (err) {
          req.payload.logger.error(
            err,
            `Error while getting orderID: ${id} status`
          );
          return res
            .status(400)
            .send(
              `Tried to get order with id ${id}, when verify status error occured`
            );
        }
      },
      method: 'get',
      path: '/status/:id',
    },
  ],
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
};

export default Orders;
