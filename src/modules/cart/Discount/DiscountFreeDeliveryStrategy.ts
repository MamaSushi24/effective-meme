import IDiscountApplication, {
  DiscountApplicationTargetSelection,
  DiscountApplicationType,
  DiscountApplicationValueType,
} from '../DiscountApplication/IDiscountApplication';
import { DiscountType } from '../enums';
import AbstractBaseDiscount, {
  IAbstractBaseDiscountConstructorParams,
} from './IBaseDiscount';
import { LineItemType } from '../CartLine/ILineItem';

export interface IDiscountApplicationFreeDelivery extends IDiscountApplication {
  targetSelection: DiscountApplicationTargetSelection.EXPLICIT;
  targetType: LineItemType.SHIPPING_LINE;
}
export interface IDiscountFreeDeliveryStrategyConstructorParams
  extends Omit<
    IAbstractBaseDiscountConstructorParams,
    'type' | 'discountApplication'
  > {
  discountApplicationType: DiscountApplicationType;
}
export default class DiscountFreeDeliveryStrategy extends AbstractBaseDiscount {
  protected _discountApplication: IDiscountApplicationFreeDelivery;
  constructor(params: IDiscountFreeDeliveryStrategyConstructorParams) {
    super({ ...params, type: DiscountType.FREE_DELIVERY });
    this._discountApplication = {
      targetSelection: DiscountApplicationTargetSelection.EXPLICIT,
      discountId: this.id,
      targetType: LineItemType.SHIPPING_LINE,
      title: params.title,
      totalAllocatedAmount: 0,
      type: params.discountApplicationType,
      value: 100,
      valueType: DiscountApplicationValueType.PERCENTAGE,
    };
  }

  apply(): Promise<void> {
    this._order.lines.forEach(line => {
      line.applyDiscount(this._discountApplication);
    });
    return Promise.resolve();
  }
}
