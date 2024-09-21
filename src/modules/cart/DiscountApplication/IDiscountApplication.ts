import { LineItemType } from '../CartLine/ILineItem';

export enum DiscountApplicationTargetSelection {
  /** The discount applies to all line items or shipping lines. */
  ALL = 'ALL',

  /**The discount applies to a specific set of line items or shipping lines based on some criteria. */
  ENTITLED = 'ENTITLED',

  /**The discount applies to a specific line item or shipping line. */
  EXPLICIT = 'EXPLICIT',
}
export enum DiscountApplicationType {
  AUTOMATIC = 'AUTOMATIC',
  DISCOUNT_CODE = 'DISCOUNT_CODE',
}
export enum DiscountApplicationValueType {
  /**The discount amount is applied as a percentage. */
  PERCENTAGE = 'PERCENTAGE',

  /**The discount amount is a fixed value. */
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}
export default interface IDiscountApplication {
  /**The selection method for line items or shipping lines to be discounted. */
  readonly targetSelection: DiscountApplicationTargetSelection;

  /**The type of line items or shipping lines to be discounted. */
  readonly targetType: LineItemType;

  /**The customer-facing name of the discount. */
  readonly title: string;

  // The unique identifier of the discount code that was used at the time of application.
  readonly discountId: string;

  /**The total amount of the discount */
  totalAllocatedAmount: number;

  /**The type of discount. */
  readonly type: DiscountApplicationType;

  /**The value of the discount. */
  readonly value: number;

  /** The value type of the discount. */
  readonly valueType: DiscountApplicationValueType;
}
