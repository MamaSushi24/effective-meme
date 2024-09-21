import { Endpoint, PayloadHandler } from 'payload/config';
import * as Yup from 'yup';
import { Order, Product } from '../../../../types/payload-types';
import axios from 'axios';
import { PayUAPI } from '../../../../services/api/payu';
import { IGetDeliveryZoneByAddressResponse } from '../../../../payload/endpoints/syrve/get-delivery-zone-by-address';
import OrderBuilder from '../../../../modules/cart/OrderBuilder';
import {
  DeliveryStrategyType,
  PaymentType,
} from '../../../../modules/cart/types';
// TODO:
// Check if all products are available
const schema = Yup.object().shape({
  customer: Yup.object()
    .shape({
      name: Yup.string().required(),
      phone: Yup.string().required(),
    })
    .required(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productID: Yup.string().required(),
        quantity: Yup.number().required(),
      })
    )
    .required(),
  delivery: Yup.object()
    .shape({
      type: Yup.string()
        .oneOf<Order['delivery']['type']>(['self', 'delivery'])
        .required(),
      address: Yup.string().when('type', {
        is: (val: string) => val === 'delivery',
        then: obj => Yup.string().required(),
        otherwise: obj => Yup.string().nullable(),
      }),
      streetName: Yup.string().when('type', {
        is: (val: string) => val === 'delivery',
        then: obj => Yup.string().required(),
        otherwise: obj => Yup.string().nullable(),
      }),
      streetId: Yup.string().when('type', {
        is: (val: string) => val === 'delivery',
        then: obj => Yup.string().required(),
        otherwise: obj => Yup.string().nullable(),
      }),
      house: Yup.string().when('type', {
        is: (val: string) => val === 'delivery',
        then: obj => Yup.string().required(),
        otherwise: obj => Yup.string().nullable(),
      }),
      flat: Yup.string().nullable(),
      floor: Yup.string().nullable(),
      postcode: Yup.string().nullable(),
      date: Yup.string().nullable(),
      time: Yup.string().nullable(),
    })
    .required(),
  payment: Yup.object()
    .shape({
      type: Yup.string()
        .oneOf<Order['payment']['type']>(['cash', 'terminal', 'online'])
        .required(),
    })
    .required(),
  discount: Yup.object()
    .shape({
      id: Yup.string().nullable(),
      code: Yup.string().nullable(),
    })
    .nullable(),
  commets: Yup.string().nullable(),
  discountID: Yup.string().nullable(),
  numberOfPeople: Yup.number().required(),
  numberOfSticksWithHelper: Yup.number().required(),
  comments: Yup.object().nullable(),
});
export type TCheckoutBody = Yup.InferType<typeof schema>;
const handler: PayloadHandler = async (req, res) => {
  const Payload = req.payload;
  const body = req.body as TCheckoutBody;
  try {
    await schema.validate(body, {
      abortEarly: false,
      strict: false,
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors, status: err.name });
    return;
  }
  const orderBuilder = new OrderBuilder();

  try {
    await orderBuilder.init();
    const promises = body.items.map(line =>
      orderBuilder.addLineItem({
        productId: line.productID,
        quantity: line.quantity,
      })
    );
    await Promise.all(promises);
    orderBuilder.setCustomerName(body.customer.name);
    orderBuilder.setPhone(body.customer.phone);
    orderBuilder.setDiscountCode(body.discount?.code ?? '');

    const deliveryType = {
      self: DeliveryStrategyType.PICKUP,
      delivery: DeliveryStrategyType.DELIVERY_BY_COURIER,
    };
    orderBuilder.setDeliveryOptions({
      type: deliveryType[body.delivery.type],
      address: {
        house: body.delivery.house as string,
        street: {
          id: body.delivery.streetId as string,
          name: body.delivery.streetName as string,
        },
        flat: body.delivery.flat as string,
        floor: body.delivery.floor as string,
        index: body.delivery.postcode as string,
      },
    });

    const paymentType = {
      cash: PaymentType.CASH,
      terminal: PaymentType.CARD,
      online: PaymentType.ONLINE,
    };
    orderBuilder.setPaymentType(paymentType[body.payment.type]);
    const order = await orderBuilder.build();

    // orderData.cartLines = items;

    const orderData: Omit<Order, 'id' | 'updatedAt' | 'createdAt'> = {
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
      },
      discountStrategiesApplied: order.discountStrategiesApplied.map(
        el => el.id
      ),
      guestsCount:
        body.numberOfPeople > body.numberOfSticksWithHelper
          ? body.numberOfPeople
          : body.numberOfSticksWithHelper,
      // deliveryPrice: (order.totalPriceWithDelivery - order.totalPrice),
      cartPrice: order.originalTotalPrice / 100,
      cartPriceWithDiscount: order.totalPrice / 100,
      discountMoney: order.totalDiscount / 100,
      totalWithDelivery: order.totalPriceWithDelivery / 100,
      cartLines: order.lines.map(line => ({
        product: line.product.id,
        quantity: line.quantity,
        price: line.finalLinePrice / 100,
      })),
      payment: {
        type: body.payment.type,
        status: 'pending',
      },
      deliveryPrice: 0,
      discountPercent: 0,
    } as Order;

    // Delivery

    if (body.delivery.type === 'delivery') {
      try {
        const resp = await axios
          .get<IGetDeliveryZoneByAddressResponse>(
            process.env.PAYLOAD_PUBLIC_SERVER_URL +
              '/api/syrve/get-delivery-zone-by-address',
            {
              params: {
                streetId: body.delivery.streetId,
                house: body.delivery.house,
              },
            }
          )
          .then(res => res.data);
        if (resp.status !== 'ok') {
          res.status(400).json({
            status: 'Error on delivery zone assign',
            code: resp.code,
            msg: resp.msg,
          });
          return;
        }
        orderData.delivery = {
          type: 'delivery',
          street: body.delivery.address,
          streetName: body.delivery.streetName,
          streetId: body.delivery.streetId,
          house: body.delivery.house,
          flat: body.delivery.flat,
          floor: body.delivery.floor,
          postcode: body.delivery.postcode,
          date: body.delivery.date,
          time: body.delivery.time,
        };
        orderData.deliveryZone = resp.result?.zoneName || 'unknown';
        orderData.deliveryZoneID = resp.result?.zoneId || 'unknown';
      } catch (err) {
        res.status(500).json({
          status: 'fail',
          code: 'error_fetching_delivery_zone',
          msg: 'Something went wrong',
        });
        return;
      }
    }

    if (body.delivery.type === 'self') {
      orderData.delivery = {
        type: 'self',
        date: body.delivery.date,
        time: body.delivery.time,
      };
      orderData.deliveryZone = 'self';
      // orderData.deliveryPrice = 0;
    }

    if (body.payment.type === 'online') {
      //   Create order in PayU
      try {
        const payUApi = new PayUAPI();
        const products = order.lines.map(item => {
          const unitPrice = item.finalPrice;
          const name = item.product.nameSyrve;
          return {
            name: name,
            unitPrice,
            quantity: item.quantity,
          };
        });
        const totalAmount = products.reduce(
          (acc, item) => acc + item.unitPrice * item.quantity,
          0
        );
        const payUOrder = await payUApi.createOrder({
          notifyUrl: 'https://www.mamasushi.eu/api/orders/payu',
          currencyCode: 'PLN',
          customerIp:
            (req.headers['x-forwarded-for'] as string) || req.ip || '127.0.0.1',
          description: 'MAMASUSHI.EU',
          totalAmount,
          products,
        });
        if (payUOrder.status.statusCode !== 'SUCCESS') {
          res.status(400).json({
            status: 'fail',
            code: 'payu_order_status_not_success',
            msg: ' Something went wrong while creating order in PayU, response status is not SUCCESS',
          });
          req.payload.logger.warn(
            'Something went wrong while creating order in PayU, response status is not SUCCESS'
          );
          req.payload.logger.warn(payUOrder);
          return;
        }
        orderData.payment = {
          type: 'online',
          status: 'pending',
          transactionData: payUOrder.orderId,
          link: payUOrder.redirectUri,
        };
        orderData.payuOrderId = payUOrder.orderId;
      } catch (err) {
        res.status(500).json({
          status: 'fail',
          msg: 'Something went wrong while creating order in PayU, on server side',
        });
        req.payload.logger.warn(
          'Something went wrong while creating order in PayU, on server side'
        );
        req.payload.logger.warn(err);
        return;
      }
    }
    // Comments
    if (body.comments)
      orderData.comment = Object.values(body.comments)
        .filter(Boolean)
        .join('\n');

    // Create order in Payload
    try {
      const createdOrder = await Payload.create({
        collection: 'orders',
        data: orderData,
      });
      res.status(201).json({ status: 'ok', order: createdOrder });
      req.payload.logger.info(`Order ${createdOrder.id} created in cms`);
    } catch (err) {
      res.status(500).json({ status: 'fail', msg: 'Fail create order in cms' });
      req.payload.logger.warn('Fail create order in cms');
      req.payload.logger.warn(err);
      return;
    }
  } catch (e: any) {
    res.status(500).json({ message: e?.message });
    return;
  }
};
const endpointObj: Endpoint = {
  handler,
  method: 'post',
  path: '/checkout',
};
export default endpointObj;
