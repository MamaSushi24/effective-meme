import AbstractDeliveryStrategy from './IDeliveryStrategy';
import Order from '../IOrder';
import IDeliveryStrategy from './IDeliveryStrategy';
import { DeliveryStrategyType, IDeliveryAddress } from '../types';
import IProduct from '../Product/IProduct';
import IRepository from '../Repository/IRepository';
import CartLine from '../CartLine/CartLine';
import { LineItemType } from '../CartLine/ILineItem';
import axios from 'axios';

export class DeliveryByCurierDeliveryStrategy implements IDeliveryStrategy {
  constructor(public repository: IRepository) {}
  public async execute(order: Order): Promise<void> {
    if (!order.delivery.point.address) {
      throw new Error('Delivery address is not set');
    }
    order.delivery.type = DeliveryStrategyType.DELIVERY_BY_COURIER;
    if (order.totalQuantity === 0) {
      order.delivery.price = 0;
      return;
    }
    const deliveryProduct = await this.getDeliveryProduct(
      {
        house: order.delivery.point.address.house,
        street: {
          id: order.delivery.point.address.street.id,
          name: order.delivery.point.address.street.name,
        },
      },
      order.locale
    );

    const deliveryLine = new CartLine(
      deliveryProduct,
      1,
      LineItemType.SHIPPING_LINE,
      order
    );
    order.addLineItem(deliveryLine);
    order.delivery.price = deliveryProduct.price;
  }
  private async getDeliveryProduct(
    address: Pick<IDeliveryAddress, 'house' | 'street'>,
    locale: 'pl' | 'en' | 'ru' | 'uk' = 'pl'
  ): Promise<IProduct | never> {
    try {
      const res = await axios
        .get(
          `${process.env.SERVER_URL}/api/syrve/get-delivery-zone-by-address` as string,
          {
            params: {
              streetId: address.street.id,
              house: address.house,
            },
          }
        )
        .then(res => res.data);
      if (res.status !== 'ok') {
        throw new Error(res.code);
      }
      const deliveryProductId = res.result.zoneId;
      const deliveryProduct = await this.repository
        .getProductsByIds([deliveryProductId], locale)
        .then(products => products[0]);
      return deliveryProduct;
    } catch (err) {
      throw new Error(err);
    }
  }
}
