import { LineItemType } from '../CartLine/ILineItem';
import IDiscountApplication, {
  DiscountApplicationTargetSelection,
} from '../DiscountApplication/IDiscountApplication';
import { DiscountType } from '../enums';
import AbstractBaseDiscount, {
  IAbstractBaseDiscountConstructorParams,
} from './IBaseDiscount';

interface IDiscountApplicationAmountOffProducts extends IDiscountApplication {
  targetSelection: DiscountApplicationTargetSelection.ENTITLED;
  targetType: LineItemType.LINE_ITEM;
}
export interface IDiscountAmountOffProductsStrategyConstructorParams
  extends Omit<IAbstractBaseDiscountConstructorParams, 'type'> {
  type?: DiscountType.AMOUNT_OFF_PRODUCTS;
  targetProductIds: string[];
  targetIDsType: 'PRODUCTS' | 'COLLECTIONS';
  onlyAppliesOncePerOrder: boolean;
  discountApplication: IDiscountApplicationAmountOffProducts;
}
export default class DiscountAmountOffProductsStrategy extends AbstractBaseDiscount {
  protected _targetProductIds: string[];
  protected _discountApplication: IDiscountApplicationAmountOffProducts;
  protected _onlyAppliesOncePerOrder: boolean;
  constructor(params: IDiscountAmountOffProductsStrategyConstructorParams) {
    super({ ...params, type: DiscountType.AMOUNT_OFF_PRODUCTS });
    this._targetProductIds = params.targetProductIds;
    this._discountApplication = params.discountApplication;
    this._onlyAppliesOncePerOrder = params.onlyAppliesOncePerOrder;
  }
  apply(): Promise<void> {
    if (this._onlyAppliesOncePerOrder) {
      const targetLine = this._order.lines.find(line =>
        this._targetProductIds.includes(line.productId)
      );
      if (targetLine) {
        targetLine.applyDiscount(this._discountApplication);
      }
      return Promise.resolve();
    }
    this._order.lines.forEach(line => {
      if (this._targetProductIds.includes(line.productId)) {
        line.applyDiscount(this._discountApplication);
      }
    });
    return Promise.resolve();
  }
}
