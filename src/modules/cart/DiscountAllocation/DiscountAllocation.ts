import ILineItem from '../CartLine/ILineItem';
import IDiscountApplication, {
  DiscountApplicationTargetSelection,
} from '../DiscountApplication/IDiscountApplication';
import Order from '../IOrder';
import roundAndReturnPositive from '../utils/roundAndReturnPositive';
import ICartDiscountAllocation from './ICartDiscountAllocation';

export default class DiscountAllocation implements ICartDiscountAllocation {
  constructor(
    public readonly discountApplication: IDiscountApplication,
    protected lineItem: ILineItem,
    protected order: Order
  ) {}
  get amount(): number {
    let amount = 0;
    switch (this.discountApplication.valueType) {
      case 'PERCENTAGE':
        amount = this.percentStrategy(
          this.lineItem.originalLinePrice,
          this.discountApplication.value
        );
        break;
      case 'FIXED_AMOUNT':
        amount = this.fixedAmountStrategy();
        break;
      default:
        throw new Error('Invalid DiscountApplicationValueType');
    }
    return roundAndReturnPositive(amount);
  }

  protected percentStrategy(baseAmount: number, percent: number): number {
    return (baseAmount / 100) * percent;
  }

  protected fixedAmountStrategy(): number {
    if (this.discountApplication.targetSelection === 'ALL') {
      const percentReletiveToOrder =
        (this.discountApplication.value / this.order.originalTotalPrice) * 100;
      return this.percentStrategy(
        this.lineItem.originalLinePrice,
        percentReletiveToOrder
      );
    }
    return this.discountApplication.value;
  }
}
