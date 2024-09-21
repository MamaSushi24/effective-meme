import CartLine from '../CartLine/CartLine';
import { LineItemType } from '../CartLine/ILineItem';
import IDiscountApplication from '../DiscountApplication/IDiscountApplication';
import Order from '../IOrder';
import IRepository from '../Repository/IRepository';
import { DiscountMethod, DiscountType } from '../enums';
import { TDiscountApplicationCondition } from '../types';
import AbstractBaseDiscount, {
  IAbstractBaseDiscountConstructorParams,
} from './IBaseDiscount';

export interface IDiscountBuyXGetYStrategyConstructorParams
  extends Omit<IAbstractBaseDiscountConstructorParams, 'type'> {
  YItem: {
    productId: string;
    quantity: number;
  };
  discountApplication: IDiscountApplication;
}
export default class DiscountBuyXGetYStrategy extends AbstractBaseDiscount {
  protected _discountApplication: IDiscountApplication;
  protected YItem: {
    productId: string;
    quantity: number;
  };
  async apply(): Promise<void> {
    const productData = await this._repository
      .getProductsByIds([this.YItem.productId], this._order.locale)
      .then(products => products[0]);
    const lineItem = new CartLine(
      productData,
      this.YItem.quantity,
      LineItemType.AUTOMATIC_LINE_ITEM,
      this._order
    );
    lineItem.applyDiscount(this._discountApplication);
    this._order.addLineItem(lineItem);
  }
  constructor(params: IDiscountBuyXGetYStrategyConstructorParams) {
    super({ ...params, type: DiscountType.BUY_X_GET_Y });
    this._discountApplication = params.discountApplication;
    this.YItem = params.YItem;
  }
}
