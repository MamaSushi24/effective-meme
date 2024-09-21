import Order from '../IOrder';
import IPaymentStrategy from './IPaymentStrategy';

export default class CODPaymentStrategy implements IPaymentStrategy {
  public async execute(order: Order): Promise<void> {
    order.payment.sum = order.totalPriceWithDelivery;
  }
}
