import Order from '../IOrder';
import Repository from '../Repository/Repository';
import {
  DeliveryStrategyType,
  DiscountApplicationConditionType,
  IDiscountConditionMinimumPurchaseAmount,
  IDiscountConditionMinimumQuantityOfItems,
  TDiscountApplicationCondition,
} from '../types';

export class DiscountConditionTester {
  private readonly _order: Order;

  constructor(order: Order) {
    this._order = order;
  }

  public async test(
    conditions: TDiscountApplicationCondition[]
  ): Promise<boolean> {
    const promises = conditions.map(async condition => {
      switch (condition.type) {
        case DiscountApplicationConditionType.DISCOUNT_CODE:
          return this.isDiscountCodeEquals(condition.value);
        case DiscountApplicationConditionType.TOTAL_PRICE_MORE_OR_EQUALS:
          return this.isTotalPriceMoreOrEquals(condition.value);
        case DiscountApplicationConditionType.TOTAL_QUANTITY_MORE_OR_EQUALS:
          return this.isTotalQuantityMoreOrEquals(condition.value);
        case DiscountApplicationConditionType.MINIMUM_QUANTITY_OF_ITEMS:
          return this.isQuantityOfItemsMoreOrEquals(condition);
        case DiscountApplicationConditionType.MINIMUM_PURCHASE_AMOUNT_OF_ITEMS:
          return this.isPurchaseAmounOfItemMoreOrEquals(condition);
        case DiscountApplicationConditionType.DELIVERY_TYPE:
          return this.isDeliveryTypeEquals(condition.value);
        case DiscountApplicationConditionType.CAN_BE_COMBINED_WITH:
          return this.isAllAppliedDiscountsInCombinations(condition.value);
        case DiscountApplicationConditionType.USED_ONLY_ONCE_PER_CUSTOMER:
          return this.isDiscountUsedByCustomer(condition.discountID);
        default:
          throw new Error('Unknown discount condition type');
      }
    });
    const result = await Promise.all(promises).then(results =>
      results.every(result => result)
    );
    return result;
  }

  private isDiscountCodeEquals(code: string): boolean {
    const lowerCaseCode = code.toLowerCase();
    const orderDiscountCode =
      typeof this._order.discountCode === 'string' &&
      this._order.discountCode.toLowerCase();
    return lowerCaseCode === orderDiscountCode;
  }

  private isTotalPriceMoreOrEquals(amount: number): boolean {
    const priceWithoutDelivery =
      this._order.totalPrice - this._order.deliveryPrice;
    return priceWithoutDelivery >= amount;
  }

  private isTotalQuantityMoreOrEquals(amount: number): boolean {
    const deliveryQuantity = this._order.lines.reduce((acc, line) => {
      if (line.type === 'SHIPPING_LINE') return acc + line.quantity;
      return acc;
    }, 0);
    const totalQuantityWithoutDelivery =
      this._order.totalQuantity - deliveryQuantity;
    return totalQuantityWithoutDelivery >= amount;
  }

  private isQuantityOfItemsMoreOrEquals({
    value,
    productIDs,
    appliesToType,
  }: IDiscountConditionMinimumQuantityOfItems): boolean {
    return (
      this._order.lines
        .filter(line => {
          if (appliesToType === 'COLLECTIONS') {
            if (!line.product?.parentGroup) return false;
            return productIDs.includes(line.product?.parentGroup);
          }
          return productIDs.includes(line.productId);
        })
        .reduce((acc, line) => acc + line.quantity, 0) >= value
    );
  }

  private isPurchaseAmounOfItemMoreOrEquals({
    value,
    productIDs,
  }: IDiscountConditionMinimumPurchaseAmount): boolean {
    return (
      this._order.lines
        .filter(line => productIDs.includes(line.productId))
        .reduce((acc, line) => acc + line.finalLinePrice, 0) >= value
    );
  }

  private isDeliveryTypeEquals(type: DeliveryStrategyType): boolean {
    return this._order.delivery.type === type;
  }

  private isAllAppliedDiscountsInCombinations(combinations: string[]): boolean {
    const allAppliedDiscountIDs = this._order.discountStrategiesApplied.map(
      discount => discount.id
    );
    return allAppliedDiscountIDs.every(id => combinations.includes(id));
  }

  private async isDiscountUsedByCustomer(discountID: string): Promise<boolean> {
    if (!this._order.phone) return true;
    const repository = await Repository.getInstance();
    const usedCount = await repository.getDiscountStrategyUsedByPhone(
      this._order.phone,
      discountID
    );
    return usedCount === 0;
  }
}
