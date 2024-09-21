import DiscountAllocation from '../DiscountAllocation/DiscountAllocation';
import ICartDiscountAllocation from '../DiscountAllocation/ICartDiscountAllocation';
import IDiscountApplication from '../DiscountApplication/IDiscountApplication';
import Order from '../IOrder';
import IProduct from '../Product/IProduct';
import roundAndReturnPositive from '../utils/roundAndReturnPositive';
import ILineItem, { LineItemType } from './ILineItem';

export default class CartLine implements ILineItem {
  // type: LineItemType;
  discountAllocations: ICartDiscountAllocation[] = [];
  // finalLinePrice: number;
  // finalPrice: number;
  // totalDiscount: number;
  // originalLinePrice: number;
  originalPrice: number;
  productId: string;
  // product: IProduct;
  // quantity: number;
  url: string;
  title: string;
  constructor(
    public readonly product: IProduct,
    public readonly quantity: number,
    public readonly type: LineItemType = LineItemType.LINE_ITEM,
    protected readonly order: Order
  ) {
    this.originalPrice = this.product.price;
    this.productId = this.product.id;
    this.url = this.product.url;
    this.title = this.product.name;
  }
  get originalLinePrice(): number {
    return this.originalPrice * this.quantity;
  }
  get totalDiscount(): number {
    return roundAndReturnPositive(
      this.discountAllocations.reduce((acc, { amount }) => acc + amount, 0)
    );
  }
  get finalPrice(): number {
    const discountPerUnit = this.totalDiscount / this.quantity;
    return roundAndReturnPositive(this.originalPrice - discountPerUnit);
  }
  get finalLinePrice(): number {
    return this.finalPrice * this.quantity;
  }

  public applyDiscount(discountApplication: IDiscountApplication): void {
    if (discountApplication.targetType !== this.type) return;
    const discountAllocation = new DiscountAllocation(
      discountApplication,
      this,
      this.order
    );
    discountApplication.totalAllocatedAmount += discountAllocation.amount;
    this.discountAllocations.push(discountAllocation);
  }
  public toJSON(): Omit<ILineItem, 'applyDiscount' | 'toJSON'> {
    return {
      discountAllocations: this.discountAllocations.map(allocation => ({
        amount: allocation.amount,
        discountApplication: {
          ...allocation.discountApplication,
          lineItem: undefined,
        } as IDiscountApplication,
      })),
      finalLinePrice: this.finalLinePrice,
      finalPrice: this.finalPrice,
      originalLinePrice: this.originalLinePrice,
      originalPrice: this.originalPrice,
      productId: this.productId,
      product: this.product,
      quantity: this.quantity,
      title: this.title,
      type: this.type,
      url: this.url,
      totalDiscount: this.totalDiscount,
    };
  }
}
