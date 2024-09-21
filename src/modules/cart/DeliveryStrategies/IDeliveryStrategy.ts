import AbstractOrder from '../IOrder';
import IRepository from '../Repository/IRepository';
import { DeliveryStrategyType } from '../types';

export default interface IDeliveryStrategy {
  repository: IRepository;
  execute(order: AbstractOrder): Promise<void>;
}
