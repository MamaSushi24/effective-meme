import ICartDiscountAllocation from '../DiscountAllocation/ICartDiscountAllocation';
import IDiscountApplication from '../DiscountApplication/IDiscountApplication';
import IProduct from '../Product/IProduct';
export enum LineItemType {
  /** Simple line */
  LINE_ITEM = 'LINE_ITEM',

  SHIPPING_LINE = 'SHIPPING_LINE',

  /** Discount line */
  AUTOMATIC_LINE_ITEM = 'AUTOMATIC_LINE_ITEM',
}
export default interface ILineItem {
  type: LineItemType;
  /**The discounts that have been applied to the cart line. */
  discountAllocations: ICartDiscountAllocation[];

  // Prices
  /**The combined price, of all of the items in the line item. This includes any line-level discounts. */
  finalLinePrice: number;

  /**The price of the line item. This includes any line-level discounts. */
  finalPrice: number;

  /**The total amount of any discounts applied to the line item */
  totalDiscount: number;

  /**The combined price of all of the items in a line item, before any discounts have been applied. */
  originalLinePrice: number;

  /**The price of the line item, before discounts have been applied. */
  originalPrice: number;

  /**The ID of the line item's product. */
  productId: string;

  /**The product associated with the line item. */
  product: IProduct;

  /** The quantity of the line item. */
  quantity: number;

  /**The relative URL of the product associated with the line item. */
  url: string;

  /**The translated title of the line item. */
  title: string;

  applyDiscount(discount: IDiscountApplication): void;

  toJSON(): Omit<ILineItem, 'applyDiscount' | 'toJSON'>;
}
