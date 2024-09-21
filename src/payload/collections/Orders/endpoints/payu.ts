import { ICart } from '@/hooks/use-cart';
import { Endpoint, PayloadHandler } from 'payload/config';
import { Order, Product } from '@/types/payload-types';
import axios from 'axios';
import { PayUAPI } from '../../../../services/api/payu';
/*
{
    BODY SAMPLE:
   "order":{
      "orderId":"LDLW5N7MF4140324GUEST000P01",
      "extOrderId":"Order id in your shop",
      "orderCreateDate":"2012-12-31T12:00:00",
      "notifyUrl":"http://tempuri.org/notify",
      "customerIp":"127.0.0.1",
      "merchantPosId":"{POS ID (pos_id)}",
      "description":"My order description",
      "currencyCode":"PLN",
      "totalAmount":"200",
      "buyer":{
         "email":"john.doe@example.org",
         "phone":"111111111",
         "firstName":"John",
         "lastName":"Doe",
         "language":"en"
      },
      "payMethod": {
         "amount": "200",
         "type": "PBL" //or "CARD_TOKEN", "INSTALLMENTS"
      },
      "products":[
         {
            "name":"Product 1",
            "unitPrice":"200",
            "quantity":"1"
         }
      ],
      "status":"COMPLETED"
      },
   "localReceiptDateTime": "2016-03-02T12:58:14.828+01:00",
   "properties": [
         {
            "name": "PAYMENT_ID",
            "value": "151471228"
         }
      ]
   }      
*/
interface PayUNotifyBody {
  order: {
    orderId: string;
    extOrderId: string;
    orderCreateDate: string;
    notifyUrl: string;
    customerIp: string;
    merchantPosId: string;
    description: string;
    currencyCode: string;
    totalAmount: string;
    buyer: {
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      language: string;
    };
    payMethod: {
      amount: string;
      type: string;
    };
    products: {
      name: string;
      unitPrice: string;
      quantity: string;
    }[];
    status: 'PENDING' | 'COMPLETED' | 'WAITING_FOR_CONFIRMATION' | 'CANCELED';
  };
  localReceiptDateTime: string;
  properties: {
    name: string;
    value: string;
  }[];
}
const handler: PayloadHandler = async (req, res, next) => {
  const { orderId, status } = (req.body as PayUNotifyBody)?.order || {};
  req.payload.logger.info(req.body, 'PayU notification');
  if (!orderId || !status) {
    res.status(400).json({ status: 'error', msg: 'Invalid request' });
    return;
  }
  try {
    const order = await req.payload
      .find<'orders'>({
        collection: 'orders',
        where: {
          payuOrderId: {
            equals: orderId,
          },
        },
        overrideAccess: true,
      })
      .then(res => res.docs[0]);
    if (!order) {
      res.status(400).json({ status: 'error', msg: 'Order not found' });
      return;
    }
    let newStatus: Order['payment']['status'] = 'pending';
    switch (status) {
      case 'COMPLETED':
        newStatus = 'paid';
        break;
      case 'CANCELED':
        newStatus = 'canceled';
        break;
      case 'WAITING_FOR_CONFIRMATION':
        newStatus = 'pending';
        break;
      default:
        newStatus = 'pending';
        break;
    }
    const updOrder = await req.payload.update<'orders'>({
      collection: 'orders',
      id: order.id,
      overrideAccess: true,
      data: {
        payment: {
          status: newStatus,
        },
      },
    });
    if (updOrder?.payment?.status === 'paid') {
      req.payload.logger.info(`Order ${updOrder.id} paid`);
      res.status(200).json({ status: 'ok' });
      return;
    }
  } catch (error) {
    req.payload.logger.error(error);
  }
  res.status(400).json({ status: 'error', msg: 'Order not updated' });
};
const endpointObj: Endpoint = {
  handler,
  method: 'post',
  path: '/payu',
};
export default endpointObj;
