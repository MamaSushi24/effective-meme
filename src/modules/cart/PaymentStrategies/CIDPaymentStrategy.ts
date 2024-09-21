import Order from '../IOrder';
import { PaymentType } from '../types';
import IPaymentStrategy from './IPaymentStrategy';

export default class CIDPaymentStrategy implements IPaymentStrategy {
  public async execute(order: Order): Promise<void> {
    const { paymentId, paymentLink } = await this.createPayment(order);
    order.payment = {
      type: PaymentType.ONLINE,
      paymentId: paymentId,
      sum: order.totalPriceWithDelivery,
      paymentLink: paymentLink,
    };
  }

  private async createPayment(
    order: Order
  ): Promise<{ paymentId: string; paymentLink: string }> {
    return Promise.resolve({
      paymentId: '123',
      paymentLink: 'https://payment.com',
    });
  }
}
