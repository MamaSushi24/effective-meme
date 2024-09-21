import dayjs from '../../../../libs/dayjs';
import {
  ICreateDeliveryRequest,
  OrderTypeID,
  PaymentTypeID,
  PaymentTypeKind,
  SyrveAPIProvider,
} from '../../../../services/api/syrve.api';
import { Order } from '../../../../types/payload-types';
import { CollectionAfterChangeHook } from 'payload/types';
import payload from 'payload';
const afterChangeHook: CollectionAfterChangeHook<Order> = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}) => {
  if (operation === 'create') {
    if (doc.payment.type !== 'online') {
      try {
        const res = await createOrderFromDoc(doc);
        req.payload.logger.info(res, `Order ${doc.id} created in Syrve`);
      } catch (err) {
        req.payload.logger.error(err, `Order ${doc.id} not created in Syrve`);
      }
      return doc;
    }
  }

  if (operation === 'update') {
    req.payload.logger.info(`Order ${doc.id} update operation`);
    req.payload.logger.info(
      `Order ${doc.id} payment status ${doc.payment.status}`
    );
    req.payload.logger.info(
      `Order ${doc.id} previous payment status ${previousDoc.payment.status}`
    );
    if (doc.payment.type === 'online') {
      // Check if order is paid then create order in Syrve
      if (
        doc.payment.status === 'paid' &&
        previousDoc.payment.status !== 'paid'
      ) {
        try {
          const res = await createOrderFromDoc(doc);
          req.payload.logger.info(res, `Order ${doc.id} created in Syrve`);
        } catch (err) {
          req.payload.logger.error(err, `Order ${doc.id} not created in Syrve`);
        }
      }
    }
  }
  return doc;
};
export default afterChangeHook;

async function createOrderFromDoc(doc: Order) {
  const syrveAPI = SyrveAPIProvider.getInstance();
  const items: ICreateDeliveryRequest['order']['items'] = doc.cartLines.map(
    line => {
      const productId =
        typeof line.product === 'string' ? line.product : line.product.id;
      const price = line.price / line.quantity;
      return {
        type: 'Product',
        productId,
        amount: line.quantity,
        price,
        modifiers: [],
      };
    }
  );

  const PAYMEN_TYPE_ID: {
    [key in Order['payment']['type']]: PaymentTypeID;
  } = {
    cash: PaymentTypeID.CASH,
    terminal: PaymentTypeID.TERMINAL,
    online: PaymentTypeID.ONLINE,
  };
  const PAYMENT_TYPE_KIND: {
    [key in Order['payment']['type']]: PaymentTypeKind;
  } = {
    cash: PaymentTypeKind.CASH,
    terminal: PaymentTypeKind.TERMINAL,
    online: PaymentTypeKind.ONLINE,
  };
  const payment: ICreateDeliveryRequest['order']['payments'][0] = {
    sum: doc.totalWithDelivery,
    // isProcessedExternally: false,
    paymentTypeId: PAYMEN_TYPE_ID[doc.payment.type],
    paymentTypeKind: PAYMENT_TYPE_KIND[doc.payment.type],
  };
  const data: ICreateDeliveryRequest['order'] = {
    comment: doc.comment || '',
    customer: {
      name: doc.customer.name,
      surname: '',
      email: '',
    },
    phone: doc.customer.phone,
    guests: {
      count: doc.guestsCount,
      splitBetweenPersons: false,
    },
    orderTypeId:
      doc.delivery.type === 'delivery'
        ? OrderTypeID.DELIVERY
        : OrderTypeID.PICKUP,
    items: items,
    payments: [payment],
  } as ICreateDeliveryRequest['order'];
  const completeBefore = getCompleteBeforeTime(
    doc.delivery.date,
    doc.delivery.time
  );
  if (completeBefore) data.completeBefore = completeBefore;
  if (
    doc.delivery.type === 'delivery' &&
    data.orderTypeId === OrderTypeID.DELIVERY
  ) {
    const formattedIndex =
      typeof doc.delivery.postcode === 'string'
        ? doc.delivery.postcode.trim().substring(0, 9)
        : null;
    if (formattedIndex)
      data.comment = data.comment + '\n Postcode: ' + formattedIndex;
    const orderId = doc.orderId ? `\n Order ID: ${doc.orderId}` : '';
    data.deliveryPoint = {
      address: {
        street: {
          id: doc.delivery.streetId as string,
          name: doc.delivery.streetName as string,
        },
        index: formattedIndex,
        house: doc.delivery.house as string,
        flat: doc.delivery.flat ?? null,
        floor: doc.delivery.floor ?? null,
        entrance: null,
      },
      comment: orderId + data.comment,
    };
  }

  payload.logger.info(
    {
      order: data,
    },
    `Order ${doc.id} data to send to Syrve`
  );
  return await syrveAPI.createDelivery(data);
}
function getCompleteBeforeTime(
  date: Order['delivery']['date'],
  time: Order['delivery']['time']
) {
  // format date to yyyy-MM-dd HH:mm:ss.fff with dateJs
  if (!date && !time) return null;
  if (date === 'today' && time === 'now') return null;
  const dateObj =
    date === 'today'
      ? dayjs().tz('Europe/Warsaw')
      : dayjs(date, 'DD.MM').tz('Europe/Warsaw');
  if (dateObj.isSame(dayjs(), 'day') && !time) return null;
  const timeToSet = time ? time : '00:00';
  const hours = parseInt(timeToSet.split(':')[0]);
  const minutes = parseInt(timeToSet.split(':')[1]);
  const objWithTime = dateObj.set('hour', hours).set('minute', minutes);
  if (!objWithTime.isValid()) {
    payload.logger.error(
      `Invalid date ${date} and time ${time} for order completeBefore`
    );
    return null;
  }

  return objWithTime.format('YYYY-MM-DD HH:mm:ss.SSS');
}
