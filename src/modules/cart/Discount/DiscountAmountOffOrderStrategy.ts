import { LineItemType } from '../CartLine/ILineItem';
import IDiscountApplication, {
  DiscountApplicationTargetSelection,
} from '../DiscountApplication/IDiscountApplication';
import { DiscountType } from '../enums';
import AbstractBaseDiscount, {
  IAbstractBaseDiscountConstructorParams,
} from './IBaseDiscount';

export interface IDiscountApplicationAmountOffOrder
  extends IDiscountApplication {
  targetSelection: DiscountApplicationTargetSelection;
  targetType: LineItemType.LINE_ITEM;
}
export interface IDiscountAmountOffOrderStrategyConstructorParams
  extends Omit<IAbstractBaseDiscountConstructorParams, 'type'> {
  discountApplication: IDiscountApplicationAmountOffOrder;
  type?: DiscountType.AMOUNT_OFF_ORDER;
}
export default class DiscountAmountOffOrderStrategy extends AbstractBaseDiscount {
  protected _discountApplication: IDiscountApplicationAmountOffOrder;
  constructor(params: IDiscountAmountOffOrderStrategyConstructorParams) {
    super({ ...params, type: DiscountType.AMOUNT_OFF_ORDER });
    this._discountApplication = params.discountApplication;
  }
  apply(): Promise<void> {
    this._order.lines.forEach(line => {
      line.applyDiscount(this._discountApplication);
    });
    return Promise.resolve();
  }
}
