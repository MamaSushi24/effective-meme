import { DeliveryStrategyType, PaymentType } from '../../../modules/cart/types';
import OrderBuilder from '../../../modules/cart/OrderBuilder';
import { Endpoint, PayloadHandler } from 'payload/config';
import * as YUP from 'yup';
const schema = YUP.object().shape({
  customerName: YUP.string()
    .required()
    .when('$stage', ([stage], schema) => {
      if (stage === 'checkin') return schema.notRequired().nullable();
      return schema;
    }),
  phone: YUP.string().required().nullable(),
  lines: YUP.array()
    .of(
      YUP.object().shape({
        productId: YUP.string().required(),
        quantity: YUP.number().required(),
      })
    )
    .required(),
  delivery: YUP.object()
    .shape({
      type: YUP.string()
        .oneOf([
          DeliveryStrategyType.PICKUP,
          DeliveryStrategyType.DELIVERY_BY_COURIER,
        ])
        .required()
        .when('$stage', ([stage], schema) => {
          if (stage === 'checkin') return schema.notRequired().nullable();
          return schema;
        }),
      address: YUP.object()
        .shape({
          street: YUP.object()
            .shape({
              id: YUP.string().required(),
              name: YUP.string().required(),
            })
            .required(),
          house: YUP.string().required(),
          flat: YUP.string().nullable().notRequired(),
          entrance: YUP.string().nullable().notRequired(),
          floor: YUP.string().nullable().notRequired(),
        })
        .when('type', {
          is: (val: string) => val === DeliveryStrategyType.DELIVERY_BY_COURIER,
          then: schema => schema.required(),
          otherwise: schema => schema.notRequired().nullable(),
        }),
      comment: YUP.string().nullable().notRequired(),
    })
    .required()
    .when('$stage', ([stage], schema) => {
      if (stage === 'checkin') return schema.notRequired().nullable();
      return schema;
    }),
  payment: YUP.object()
    .shape({
      type: YUP.string()
        .oneOf([PaymentType.CASH, PaymentType.CARD, PaymentType.ONLINE])
        .required(),
    })
    .required()
    .when('$stage', ([stage], schema) => {
      if (stage === 'checkin') return schema.notRequired().nullable();
      return schema;
    }),
  comment: YUP.string().nullable().notRequired(),
  discountCode: YUP.string().nullable().notRequired(),
});
export type CalculateOrderRequestBody = YUP.InferType<typeof schema>;

const validate: PayloadHandler = async (req, res, next) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      strict: true,
      context: {
        stage: 'checkin',
      },
    });
    await YUP.string()
      .oneOf(['en', 'ru', 'pl', 'uk'])
      .notRequired()
      .validate(req.params.lang);
    next();
  } catch (e: any) {
    console.log('constvalidate:PayloadHandler= ~ e:', e);
    res.status(400).json({ message: e?.message, path: e?.path });
  }
  return;
};
export type TCalculateOrderResponse = ReturnType<
  Awaited<ReturnType<OrderBuilder['build']>>['toJSON']
>;
const handler: PayloadHandler = async (req, res, next) => {
  const body = req.body as CalculateOrderRequestBody;
  const orderBuilder = new OrderBuilder();

  try {
    const lang = (req.params.lang as 'pl' | 'en' | 'ru' | 'uk') ?? 'pl';
    await orderBuilder.init(lang);
    const promises = body.lines.map(line => orderBuilder.addLineItem(line));
    await Promise.all(promises);
    if (body.customerName) {
      orderBuilder.setCustomerName(body.customerName);
    }
    if (body.phone) {
      orderBuilder.setPhone(body.phone);
    }
    orderBuilder.setDiscountCode(body.discountCode ?? '');
    if (body.delivery.type) {
      orderBuilder.setDeliveryOptions(body.delivery);
    }
    orderBuilder.setPaymentType(body.payment.type);
    orderBuilder.setDeliveryComment(body.delivery.comment ?? '');
    orderBuilder.setOrderComment(body.comment ?? '');
    const order = await orderBuilder.build();
    res.status(200).json(order.toJSON());
  } catch (e: any) {
    res.status(500).json({ message: e?.message });
    return;
  }
};
const calculateOrderEndpoint: Endpoint = {
  path: '/order/calculate/:lang',
  method: 'post',
  handler: [validate, handler],
};
export default calculateOrderEndpoint;
