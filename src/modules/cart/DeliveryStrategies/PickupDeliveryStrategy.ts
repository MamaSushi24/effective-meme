import IDeliveryStrategy from './IDeliveryStrategy';
import Order from '../IOrder';
import { DeliveryStrategyType } from '../types';
import IRepository from '../Repository/IRepository';

export class PickupDeliveryStrategy implements IDeliveryStrategy {
  constructor(public respository: IRepository) {}
  repository: IRepository;
  public async execute(order: Order): Promise<void> {
    order.delivery = {
      ...order?.delivery,
      type: DeliveryStrategyType.PICKUP,
      point: {
        ...order?.delivery?.point,
        address: null,
      },
      price: 0,
    };
  }
}
