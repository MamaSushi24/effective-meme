import IDiscountApplication from '../DiscountApplication/IDiscountApplication';

export default interface ICartDiscountAllocation {
  /**The amount that the item is discounted */
  amount: number;
  /**The discount application that applies the discount to the item. */
  discountApplication: IDiscountApplication;
}
