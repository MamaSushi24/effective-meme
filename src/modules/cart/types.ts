import IOrder from './IOrder';

export enum DiscountApplicationConditionType {
  /**The discount applies when the order has a specific discount code. */
  DISCOUNT_CODE = 'DISCOUNT_CODE',

  /**The discount applies when the order amount more or equals. */
  TOTAL_PRICE_MORE_OR_EQUALS = 'TOTAL_PRICE_MORE_OR_EQUALS',

  /**The discount applies when quantity of items more or equals. */
  TOTAL_QUANTITY_MORE_OR_EQUALS = 'TOTAL_QUANTITY_MORE_OR_EQUALS',

  /**The discount applies when number of times this discount can be used in total less or equals. */
  DISCOUNT_USED_LESS_OR_EQUALS = 'DISCOUNT_USED_LESS_OR_EQUALS',

  /**The discount applies when never has been used by customer. */
  USED_ONLY_ONCE_PER_CUSTOMER = 'USED_ONLY_ONCE_PER_CUSTOMER',

  /**The discount applies when the order has not other discounts not spicified in combination. */
  CAN_BE_COMBINED_WITH = 'CAN_BE_COMBINED_WITH',

  /**The discount applies when the order has a specific delivery type. */
  DELIVERY_TYPE = 'DELIVERY_TYPE',

  /**The discount applies when the order contains product X in quantity. */
  MINIMUM_QUANTITY_OF_ITEMS = 'MINIMUM_QUANTITY_OF_ITEMS',

  /**The discount applies when the order contains product X in purchase amount. */
  MINIMUM_PURCHASE_AMOUNT_OF_ITEMS = 'MINIMUM_PURCHASE_AMOUNT_OF_ITEMS',

  ONLY_APPLIES_ONCE_PER_ORDER = 'ONLY_APPLIES_ONCE_PER_ORDER',
}

export interface IDiscountConditionDiscountCode {
  type: DiscountApplicationConditionType.DISCOUNT_CODE;
  value: string;
}
export interface IDiscountConditionTotalPriceMoreOrEquals {
  type: DiscountApplicationConditionType.TOTAL_PRICE_MORE_OR_EQUALS;
  value: number;
}
export interface IDiscountConditionTotalQuantityMoreOrEquals {
  type: DiscountApplicationConditionType.TOTAL_QUANTITY_MORE_OR_EQUALS;
  value: number;
}
export interface IDiscountConditionNumberOfTimesUsedLessOrEquals {
  type: DiscountApplicationConditionType.DISCOUNT_USED_LESS_OR_EQUALS;
  value: number;
}
export interface IDiscountConditionUseOnlyOncePerCustomer {
  type: DiscountApplicationConditionType.USED_ONLY_ONCE_PER_CUSTOMER;
  discountID: string;
}
export interface IDiscountConditionCanBeCombinedWith {
  type: DiscountApplicationConditionType.CAN_BE_COMBINED_WITH;
  value: string[];
}
export interface IDiscountConditionDeliveryType {
  type: DiscountApplicationConditionType.DELIVERY_TYPE;
  value: DeliveryStrategyType;
}

export interface IDiscountConditionMinimumQuantityOfItems {
  type: DiscountApplicationConditionType.MINIMUM_QUANTITY_OF_ITEMS;
  value: number;
  productIDs: string[];
  appliesToType: 'PRODUCTS' | 'COLLECTIONS';
}
export interface IDiscountConditionMinimumPurchaseAmount {
  type: DiscountApplicationConditionType.MINIMUM_PURCHASE_AMOUNT_OF_ITEMS;
  value: number;
  productIDs: string[];
  appliesToType: 'PRODUCTS' | 'COLLECTIONS';
}
export interface IDiscountConditionCanBeCombinedWith {
  type: DiscountApplicationConditionType.CAN_BE_COMBINED_WITH;
  value: string[];
}
export type TDiscountApplicationCondition =
  | IDiscountConditionDiscountCode
  | IDiscountConditionTotalPriceMoreOrEquals
  | IDiscountConditionTotalQuantityMoreOrEquals
  | IDiscountConditionNumberOfTimesUsedLessOrEquals
  | IDiscountConditionUseOnlyOncePerCustomer
  | IDiscountConditionCanBeCombinedWith
  | IDiscountConditionDeliveryType
  | IDiscountConditionMinimumQuantityOfItems
  | IDiscountConditionMinimumPurchaseAmount
  | IDiscountConditionCanBeCombinedWith;
export enum DiscountType {
  AMOUNT_OF_PRODUCT = 'AMOUNT_OF_PRODUCT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  AMOUT_OF_ORDER = 'AMOUT_OF_ORDER',
  FREE_DELIVERY = 'FREE_DELIVERY',
}
/**
 * Enum representing the types of delivery strategies for an order.
 */
export enum DeliveryStrategyType {
  /** The delivery strategy that is used when the customer picks up the order in person. */
  PICKUP = 'PICKUP',

  /** The delivery strategy that is used when the order is shipped to the customer. */
  DELIVERY_BY_COURIER = 'DELIVERY_BY_COURIER',
}

/**
 * Enum representing the types of payment for an order.
 */
export enum PaymentType {
  /** The payment type that is used when the customer pays for the order in cash  on delivery.. */
  CASH = 'CASH',

  /** The payment type that is used when the customer pays for the order by card  on delivery.. */
  CARD = 'CARD',

  /** The payment type that is used when the customer pays for the order online in advance. */
  ONLINE = 'ONLINE',
}

/**
 * Represents the type of payment strategy.
 */
export enum PaymentStrategyType {
  /** The payment strategy that is used when the customer pays for the order in cash  on delivery.. */
  COD = 'COD',

  /** The payment strategy that is used when the customer pays for the order in advance */
  CID = 'CID',
}
/**
 * Represents the delivery address for an order.
 */
export interface IDeliveryAddress {
  street: {
    id: string;
    name: string;
  };
  index?: string | null;
  house: string;
  flat?: string | null;
  entrance?: string | null;
  floor?: string | null;
}
export interface ISetDeliveryOptionsPickup {
  type: DeliveryStrategyType.PICKUP;
  comment?: string | null;
}
export interface ISetDeliveryOptionsDeliveryByCurier {
  type: DeliveryStrategyType.DELIVERY_BY_COURIER;
  address: IDeliveryAddress;
  comment?: string | null;
}

export interface ICODPayment {
  type: PaymentType.CARD | PaymentType.CASH;
  sum: number;
}
export interface ICIDPayment {
  type: PaymentType.ONLINE;
  paymentId: string;
  sum: number;
  paymentLink: string;
}
