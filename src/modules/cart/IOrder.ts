import AbstractDeliveryStrategy from './DeliveryStrategies/IDeliveryStrategy';
import ILineItem, { LineItemType } from './CartLine/ILineItem';
import {
  DeliveryStrategyType,
  ICIDPayment,
  ICODPayment,
  IDeliveryAddress,
  PaymentStrategyType,
  PaymentType,
} from './types';
import IPaymentStrategy from './PaymentStrategies/IPaymentStrategy';
import AbstractBaseDiscount from './Discount/IBaseDiscount';
import { parse, stringify, toJSON, fromJSON } from 'flatted';
import IDiscountApplication from './DiscountApplication/IDiscountApplication';
import { DiscountType } from './enums';
interface IDeliveryPointPickup {
  address?: null;
  comment?: string | null;
}
interface IDeliveryPointDeliveryByCurier {
  address: IDeliveryAddress;
  comment?: string | null;
}

export interface IDelivery {
  type: DeliveryStrategyType | null;
  point: IDeliveryPointPickup | IDeliveryPointDeliveryByCurier;
  price: number;
}

export default class Order {
  public readonly lines: ILineItem[] = [];
  /**The discounts that have been applied to the entire cart. */
  //   discountAllocations: IDiscountAllocation[];
  public customerName: string = '';
  public phone?: string;
  public comment?: string | undefined;
  /**The case-insensitive discount codes that the customer added at checkout. */
  public discountCode?: string | undefined;

  protected deliveryStrategy: AbstractDeliveryStrategy;

  protected paymentStrategy: IPaymentStrategy;

  public payment: ICODPayment | ICIDPayment = {} as ICODPayment | ICIDPayment;

  public delivery: IDelivery = {
    type: null,
    point: {
      comment: '',
    },
    price: 0,
  } as IDelivery;
  // public discountStrategiesApplied: { id: string, title: string }[] = [];
  public locale: 'pl' | 'en' | 'ru' | 'uk' = 'pl';
  get discountStrategiesApplied(): { id: string; title: string }[] {
    const linesAllocation = this.lines
      .map(line => line.discountAllocations)
      .flat()
      .map(allocation => ({
        id: allocation.discountApplication.discountId,
        title: allocation.discountApplication.title,
      }));
    const unique: { id: string; title: string }[] = [];
    linesAllocation.forEach(allocation => {
      if (!unique.find(item => item.id === allocation.id))
        unique.push(allocation);
    });
    return unique;
  }
  public setPaymentType(type: PaymentType) {
    this.payment.type = type;
  }
  public setPaymentStrategy(paymentStrategy: IPaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }
  protected _discountStragegies: AbstractBaseDiscount[] = [];

  public addDiscountStrategy(discount: AbstractBaseDiscount) {
    this._discountStragegies.push(discount);
  }

  public async executeDiscountStrategies(): Promise<void> {
    // sort discounts by type shipping last
    this._discountStragegies.sort((a, b) => {
      if (a.type === DiscountType.FREE_DELIVERY) return 1;
      if (b.type === DiscountType.FREE_DELIVERY) return -1;
      return 0;
    });
    for (const discount of this._discountStragegies) {
      await discount.execute(this);
    }
  }
  public async executePaymentStrategy(): Promise<void> {
    if (!this.paymentStrategy) throw new Error('Payment strategy is not set');
    if (!this?.payment?.type) throw new Error('Payment type is not set');
    await this.paymentStrategy.execute(this);
  }

  public setDeliveryStrategy(deliveryStrategy: AbstractDeliveryStrategy) {
    this.deliveryStrategy = deliveryStrategy;
  }
  public setDeliveryAddress(address: IDeliveryAddress) {
    this.delivery = {
      ...this.delivery,
      point: { ...this.delivery?.point, address },
    };
  }

  public setDeliveryComment(comment: string) {
    this.delivery = {
      ...this.delivery,
      point: { ...this.delivery?.point, comment },
    };
  }
  public async executeDeliveryStrategy(): Promise<void> {
    // if (!this.deliveryStrategy) throw new Error('Delivery strategy is not set');
    if (!this.deliveryStrategy) return;
    await this.deliveryStrategy.execute(this);
  }

  public addLineItem(lineItem: ILineItem) {
    this.lines.push(lineItem);
  }
  // TOTALS
  /**The total number of lines in the cart. */
  get totalQuantity(): number {
    return this.lines.reduce((acc, { quantity }) => acc + quantity, 0);
  }

  /** The total price of all of the items in the cart, before discounts have been applied. */
  get originalTotalPrice(): number {
    return this.lines.reduce(
      (acc, { originalLinePrice }) => acc + originalLinePrice,
      0
    );
  }

  /** The total amount of all discounts (the amount saved) for the cart */
  get totalDiscount(): number {
    return this.originalTotalPrice - this.totalPrice;
  }

  /**The total price of all of the items in the cart, after discounts have been applied. */
  get totalPrice(): number {
    return this.lines.reduce(
      (acc, { finalLinePrice }) => acc + finalLinePrice,
      0
    );
  }
  get deliveryPrice(): number {
    return this.lines.reduce((acc, line) => {
      if (line.type === LineItemType.SHIPPING_LINE)
        return acc + line.finalLinePrice;
      return acc;
    }, 0);
  }
  /**The total price of all of the items in the cart and delivery price, after discounts have been applied. */
  get totalPriceWithDelivery(): number {
    return this.totalPrice;
  }

  public toJSON() {
    const lines = this.lines.map(line => line.toJSON());
    // Sort lines by type (shipping line should be last) and by price (from highest to lowest)
    lines.sort((a, b) => {
      if (a.type === LineItemType.SHIPPING_LINE) return 1;
      if (b.type === LineItemType.SHIPPING_LINE) return -1;
      return b.finalLinePrice - a.finalLinePrice;
    });
    const delivery = this.delivery;
    const payment = this.payment;
    const comment = this.comment;
    const discountCode = this.discountCode;
    const totalPrice = this.totalPrice;
    const totalPriceWithDelivery = this.totalPriceWithDelivery;
    const totalDiscount = this.totalDiscount;
    const totalQuantity = this.totalQuantity;
    return {
      lines,
      delivery,
      payment,
      comment,
      discountCode,
      totalPrice,
      totalPriceWithDelivery,
      totalDiscount,
      totalQuantity,
      originalTotalPrice: this.originalTotalPrice,
      discountStrategiesApplied: this.discountStrategiesApplied,
      deliveryPrice: this.deliveryPrice,
    };
  }
}
