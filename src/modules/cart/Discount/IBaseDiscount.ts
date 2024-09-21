import Order from '../IOrder';
import IRepository from '../Repository/IRepository';
import { DiscountMethod, DiscountType } from '../enums';
import {
  DiscountApplicationConditionType,
  TDiscountApplicationCondition,
} from '../types';
import { DiscountConditionTester } from './DiscountConditionTester';

export interface IAbstractBaseDiscountConstructorParams {
  repository: IRepository;
  order: Order;
  id: string;
  title: string;
  method: DiscountMethod;
  type: DiscountType;
  combinations: string[];
  conditions: TDiscountApplicationCondition[];
  used: number;
  discountCode?: string;
  onlyOncePerCustomer: boolean;
}

export default abstract class AbstractBaseDiscount {
  public readonly id: string;
  public readonly title: string;
  public readonly method: DiscountMethod;
  public readonly type: DiscountType;
  public readonly combinations: string[];
  protected _used: number;
  protected _order: Order;
  protected _conditions: TDiscountApplicationCondition[];
  protected _conditionTester: DiscountConditionTester;
  protected _repository: IRepository;
  constructor({
    repository,
    order,
    id,
    title,
    method,
    type,
    conditions,
    combinations,
    used,
    discountCode,
    onlyOncePerCustomer,
  }: IAbstractBaseDiscountConstructorParams) {
    this.id = id;
    this.title = title;
    this.method = method;
    this.type = type;
    this.combinations = [...combinations];
    this._used = used;
    this._order = order;
    this._conditions = conditions;
    this._repository = repository;
    this._conditionTester = new DiscountConditionTester(this._order);

    // If discount method is Code then we need to add discount code condition
    if (this.method === DiscountMethod.CODE && discountCode) {
      this._conditions.push({
        type: DiscountApplicationConditionType.DISCOUNT_CODE,
        value: discountCode,
      });
    }

    // If discount can be used only once per customer then we need to add condition
    if (onlyOncePerCustomer) {
      this._conditions.push({
        type: DiscountApplicationConditionType.USED_ONLY_ONCE_PER_CUSTOMER,
        discountID: this.id,
      });
    }
    // Create combinations condition
    this._conditions.push({
      type: DiscountApplicationConditionType.CAN_BE_COMBINED_WITH,
      value: this.combinations,
    });
  }
  protected get used(): number {
    return this._used;
  }
  public incrementUsed(): void {
    this._used += 1;
    this._repository.incrementDiscountUsed(this.id);
  }

  public async execute(order: Order): Promise<void> {
    const isApplicable = await this._conditionTester.test(this._conditions);
    if (!isApplicable) return Promise.resolve();
    await this.apply();
  }
  abstract apply(): Promise<void>;
}
