import Order from '../IOrder';
import { ICODPayment, PaymentType } from '../types';
export interface ICIDPaymentStrategyOptions {
  type: PaymentType.ONLINE;
}
export interface ICODPaymentStrategyOptions {
  type: PaymentType.CASH | PaymentType.CARD;
}
export default interface IPaymentStrategy {
  execute(order: Order): Promise<void>;
}
