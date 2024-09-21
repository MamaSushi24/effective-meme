import Order from './IOrder';
import { PickupDeliveryStrategy } from './DeliveryStrategies/PickupDeliveryStrategy';
import { DeliveryByCurierDeliveryStrategy } from './DeliveryStrategies/DeliveryByCurierDeliveryStrategy';
import {
  DeliveryStrategyType,
  DiscountApplicationConditionType,
  ISetDeliveryOptionsDeliveryByCurier,
  ISetDeliveryOptionsPickup,
  PaymentType,
  TDiscountApplicationCondition,
} from './types';
import IRepository from './Repository/IRepository';
import CartLine from './CartLine/CartLine';
import CODPaymentStrategy from './PaymentStrategies/CODPaymentStrategy';
import CIDPaymentStrategy from './PaymentStrategies/CIDPaymentStrategy';
import Repository from './Repository/Repository';
import IProduct from './Product/IProduct';
import DiscountBuyXGetYStrategy from './Discount/DiscountBuyXGetYStrategy';
import IDiscountApplication, {
  DiscountApplicationTargetSelection,
  DiscountApplicationType,
  DiscountApplicationValueType,
} from './DiscountApplication/IDiscountApplication';

import { DiscountMethod, DiscountType } from './enums';
import DiscountAmountOffOrderStrategy, {
  IDiscountApplicationAmountOffOrder,
} from './Discount/DiscountAmountOffOrderStrategy';
import DiscountFreeDeliveryStrategy from './Discount/DiscountFreeDeliveryStrategy';
import { DiscountStrategy } from '@/types/payload-types';
import AbstractBaseDiscount from './Discount/IBaseDiscount';
import { LineItemType } from './CartLine/ILineItem';
import DiscountAmountOffProductsStrategy from './Discount/DiscountAmountOffProductsStrategy';
interface IAddLineItemOptions {
  productId: string;
  quantity: number;
}
[];
export default class OrderBuilder {
  private _order: Order = new Order();

  private _repository: IRepository;

  public async init(locale: 'en' | 'ru' | 'pl' | 'uk' = 'pl') {
    this._repository = await Repository.getInstance();
    this._order.locale = locale;
  }

  public setDiscountCode(code: string) {
    this._order.discountCode = code;
  }
  public setDeliveryOptions(
    options: ISetDeliveryOptionsPickup | ISetDeliveryOptionsDeliveryByCurier
  ) {
    switch (options.type) {
      case DeliveryStrategyType.PICKUP:
        this._order.setDeliveryStrategy(
          new PickupDeliveryStrategy(this._repository)
        );
        break;
      case DeliveryStrategyType.DELIVERY_BY_COURIER:
        this._order.setDeliveryAddress(options.address);
        this._order.setDeliveryStrategy(
          new DeliveryByCurierDeliveryStrategy(this._repository)
        );
        break;
      default:
        throw new Error('Unknown delivery type');
    }
  }
  public setCustomerName(name: string) {
    this._order.customerName = name;
  }
  public setPhone(phone: string) {
    this._order.phone = phone;
  }

  public setPaymentType(type: PaymentType) {
    this._order.setPaymentType(type);
    switch (type) {
      case PaymentType.CASH:
      case PaymentType.CARD:
        this._order.setPaymentStrategy(new CODPaymentStrategy());
        break;
      case PaymentType.ONLINE:
        this._order.setPaymentStrategy(new CIDPaymentStrategy());
        break;
      default:
        throw new Error('Unknown payment type');
    }
  }

  public setOrderComment(comment: string) {
    this._order.comment = comment;
  }
  public setDeliveryComment(comment: string) {
    this._order.setDeliveryComment(comment);
  }

  public async addLineItem({
    productId,
    quantity,
  }: IAddLineItemOptions): Promise<void | never> {
    if (quantity <= 0)
      throw new Error(
        'Quantity must be greater than 0, product id: ' + productId
      );
    try {
      const productData: IProduct = await this._repository
        .getProductsByIds([productId], this._order.locale)
        .then(products => products[0]);

      const lineItem = new CartLine(
        productData,
        quantity,
        LineItemType.LINE_ITEM,
        this._order
      );
      this._order.addLineItem(lineItem);
    } catch (error) {
      console.log('While adding line item', error);
      throw error;
    }
  }
  private async createDiscountStrategies() {
    const res = await this._repository.getDiscountStrategies({
      locale: this._order.locale,
    });
    return res
      .map(strategyData => {
        try {
          const strategy = this.discountStrategyFactory(strategyData);
          return strategy;
        } catch (error) {
          console.log(
            'While creating discount strategy: ' + strategyData.id,
            error
          );
          return;
        }
      })
      .filter(Boolean);
  }
  private discountStrategyFactory(
    strategyData: DiscountStrategy
  ): AbstractBaseDiscount | undefined {
    if (strategyData.type === DiscountType.AMOUNT_OFF_ORDER)
      return this.discountAmountOffOrderStrategyFactory(strategyData);
    if (strategyData.type === DiscountType.AMOUNT_OFF_PRODUCTS)
      return this.discountAmountOffProductsStrategyFactory(strategyData);
    if (strategyData.type === DiscountType.BUY_X_GET_Y)
      return this.discountBuyXGetYStrategyFactory(strategyData);
    if (strategyData.type === DiscountType.FREE_DELIVERY)
      return this.discountFreeDeliveryStrategyFactory(strategyData);
  }
  private discountFreeDeliveryStrategyFactory(
    strategyData: DiscountStrategy
  ): DiscountFreeDeliveryStrategy | undefined {
    if (!strategyData.method) return;
    const conditions: TDiscountApplicationCondition[] = [];
    if (
      strategyData.minimumPurchaseRequirements === 'AMOUNT' &&
      strategyData.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.TOTAL_PRICE_MORE_OR_EQUALS,
        value: strategyData.minimumPurchaseRequirementsValue * 100,
      });
    }

    if (
      strategyData.minimumPurchaseRequirements === 'QUANTITY' &&
      strategyData.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.TOTAL_QUANTITY_MORE_OR_EQUALS,
        value: strategyData.minimumPurchaseRequirementsValue,
      });
    }

    const res = new DiscountFreeDeliveryStrategy({
      combinations: (strategyData.combinations as string[]) ?? [],
      id: strategyData.id,
      method: strategyData.method as DiscountMethod,
      conditions: conditions,
      order: this._order,
      repository: this._repository,
      title: strategyData.title as string,
      used: strategyData.used ?? 0,
      discountCode: strategyData.discountCode ?? undefined,
      discountApplicationType: strategyData.type as DiscountApplicationType,
      onlyOncePerCustomer: Boolean(strategyData.oneUsePerCustomerEnabled),
    });
    return res;
  }
  private discountBuyXGetYStrategyFactory(
    data: DiscountStrategy
  ): DiscountBuyXGetYStrategy | undefined {
    if (
      !data.customerGetsY ||
      !data.customerGetsY?.yProduct ||
      !data?.customerGetsY?.quantity ||
      !data.customerGetsY.atDiscountedValue
    )
      return;
    if (!data.customerBuysX) return;
    const conditions: TDiscountApplicationCondition[] = [];
    if (data.customerBuysX?.xType && data.customerBuysX?.xValue) {
      switch (data.customerBuysX.xType) {
        case 'totalPrice':
          conditions.push({
            type: DiscountApplicationConditionType.TOTAL_PRICE_MORE_OR_EQUALS,
            value: Number(data.customerBuysX?.xValue) * 100,
          });
          break;
        case 'totalQuantity':
          conditions.push({
            type: DiscountApplicationConditionType.TOTAL_QUANTITY_MORE_OR_EQUALS,
            value: data.customerBuysX.xValue,
          });
          break;
        case 'totalPriceOfSpecificProducts':
          conditions.push({
            type: DiscountApplicationConditionType.MINIMUM_PURCHASE_AMOUNT_OF_ITEMS,
            value: data.customerBuysX.xValue * 100,
            appliesToType: 'PRODUCTS',
            productIDs:
              data.customerBuysX.xProducts?.map(product => {
                const { value } = product;
                if (typeof value === 'string') return value;
                return value.id;
              }) ?? [],
          });
          break;
        case 'totalQuantityOfSpecificProducts':
          conditions.push({
            type: DiscountApplicationConditionType.MINIMUM_QUANTITY_OF_ITEMS,
            value: data.customerBuysX.xValue,
            appliesToType: 'PRODUCTS',
            productIDs:
              data.customerBuysX.xProducts?.map(product => {
                const { value } = product;
                if (typeof value === 'string') return value;
                return value.id;
              }) ?? [],
          });
          break;
        default:
          break;
      }
    }

    if (data.deliveryType) {
      conditions.push({
        type: DiscountApplicationConditionType.DELIVERY_TYPE,
        value: data.deliveryType as DeliveryStrategyType,
      });
    }
    const yProdId =
      typeof data.customerGetsY.yProduct === 'string'
        ? data.customerGetsY.yProduct
        : data.customerGetsY.yProduct.id;
    const yQuantity = data.customerGetsY.quantity;

    if (
      data.customerGetsY.atDiscountedValue !== 'FREE' &&
      !data.customerGetsY.discountedValue
    )
      return;
    const res = new DiscountBuyXGetYStrategy({
      combinations: (data.combinations as string[]) ?? [],
      id: data.id,
      method: data.method as DiscountMethod,
      order: this._order,
      repository: this._repository,
      title: data.title as string,
      used: data.used ?? 0,
      discountCode: data.discountCode ?? undefined,
      YItem: {
        productId: yProdId,
        quantity: yQuantity,
      },
      conditions,
      discountApplication: {
        discountId: data.id,
        title: data.title as string,
        type: data.type as DiscountApplicationType,
        targetSelection: DiscountApplicationTargetSelection.EXPLICIT,
        targetType: LineItemType.AUTOMATIC_LINE_ITEM,
        value:
          data.customerGetsY.atDiscountedValue === 'FREE'
            ? 100
            : (data.customerGetsY.discountedValue as number),
        valueType: DiscountApplicationValueType.PERCENTAGE,
        totalAllocatedAmount: 0,
      },
      onlyOncePerCustomer: Boolean(data.oneUsePerCustomerEnabled),
    });
    return res;
  }
  private discountAmountOffProductsStrategyFactory(
    data: DiscountStrategy
  ): DiscountAmountOffProductsStrategy | undefined {
    const discountValue =
      data.discountValue?.discountValueType === 'FIXED_AMOUNT'
        ? Number(data.discountValue?.discountValue) * 100
        : data.discountValue?.discountValue;
    const targetProductIds =
      data.discountValue?.appliesTo?.map(product => {
        const { value } = product;
        if (typeof value === 'string') return value;
        return value.id;
      }) ?? [];

    const conditions: TDiscountApplicationCondition[] = [];
    const targetIDsType = data.discountValue?.appliesToType ?? 'PRODUCTS';
    if (
      data.minimumPurchaseRequirements === 'AMOUNT' &&
      data.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.MINIMUM_PURCHASE_AMOUNT_OF_ITEMS,
        value: data.minimumPurchaseRequirementsValue * 100,
        productIDs: targetProductIds,
        appliesToType: targetIDsType,
      });
    }
    if (
      data.minimumPurchaseRequirements === 'QUANTITY' &&
      data.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.MINIMUM_QUANTITY_OF_ITEMS,
        value: data.minimumPurchaseRequirementsValue,
        productIDs: targetProductIds,
        appliesToType: targetIDsType,
      });
    }

    if (data.deliveryType) {
      conditions.push({
        type: DiscountApplicationConditionType.DELIVERY_TYPE,
        value: data.deliveryType as DeliveryStrategyType,
      });
    }

    const res = new DiscountAmountOffProductsStrategy({
      id: data.id,
      title: data.title as string,
      method: data.method as DiscountMethod,
      order: this._order,
      repository: this._repository,
      used: data.used ?? 0,
      combinations: (data.combinations as string[]) ?? [],
      conditions: conditions,
      discountApplication: {
        discountId: data.id,
        targetSelection: DiscountApplicationTargetSelection.ENTITLED,
        targetType: LineItemType.LINE_ITEM,
        title: data.title as string,
        totalAllocatedAmount: 0,
        type:
          data.method === DiscountMethod.CODE
            ? DiscountApplicationType.DISCOUNT_CODE
            : DiscountApplicationType.AUTOMATIC,
        value: discountValue as number,
        valueType: data.discountValue
          ?.discountValueType as DiscountApplicationValueType,
      },
      targetProductIds: targetProductIds,
      targetIDsType: targetIDsType,
      discountCode: data.discountCode ?? undefined,
      onlyAppliesOncePerOrder: Boolean(
        data.discountValue?.onlyAppliesOncePerOrder
      ),
      onlyOncePerCustomer: Boolean(data.oneUsePerCustomerEnabled),
    });
    return res;
  }
  private discountAmountOffOrderStrategyFactory(
    strategyData: DiscountStrategy
  ): DiscountAmountOffOrderStrategy | undefined {
    if (!strategyData.method) return;
    const conditions: TDiscountApplicationCondition[] = [];
    if (
      strategyData.minimumPurchaseRequirements === 'AMOUNT' &&
      strategyData.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.TOTAL_PRICE_MORE_OR_EQUALS,
        value: strategyData.minimumPurchaseRequirementsValue * 100,
      });
    }

    if (
      strategyData.minimumPurchaseRequirements === 'QUANTITY' &&
      strategyData.minimumPurchaseRequirementsValue
    ) {
      conditions.push({
        type: DiscountApplicationConditionType.TOTAL_QUANTITY_MORE_OR_EQUALS,
        value: strategyData.minimumPurchaseRequirementsValue,
      });
    }

    if (strategyData.deliveryType) {
      conditions.push({
        type: DiscountApplicationConditionType.DELIVERY_TYPE,
        value: strategyData.deliveryType as DeliveryStrategyType,
      });
    }
    const DISCOUNT_APPLICATION_TYPE_MAP: {
      [key: string]: DiscountApplicationType;
    } = {
      AUTOMATIC: DiscountApplicationType.AUTOMATIC,
      CODE: DiscountApplicationType.DISCOUNT_CODE,
    };

    const discountValue =
      strategyData.discountValue?.discountValueType === 'FIXED_AMOUNT'
        ? Number(strategyData.discountValue?.discountValue) * 100
        : strategyData.discountValue?.discountValue;
    const discountApplication: IDiscountApplicationAmountOffOrder = {
      discountId: strategyData.id,
      targetSelection: DiscountApplicationTargetSelection.ALL,
      targetType: LineItemType.LINE_ITEM,
      title: strategyData.title as string,
      totalAllocatedAmount: 0,
      type: DISCOUNT_APPLICATION_TYPE_MAP[strategyData.method],
      value: discountValue as number,
      valueType: strategyData.discountValue
        ?.discountValueType as DiscountApplicationValueType,
    };
    return new DiscountAmountOffOrderStrategy({
      conditions,
      id: strategyData.id,
      // @ts-expect-error
      method: strategyData.method,
      order: this._order,
      repository: this._repository,
      title: strategyData.title as string,
      combinations: (strategyData.combinations as string[]) ?? [],
      discountApplication: discountApplication,
      used: strategyData.used ?? 0,
      discountCode: strategyData.discountCode ?? undefined,
      onlyOncePerCustomer: Boolean(strategyData.oneUsePerCustomerEnabled),
    });
  }
  public async build(): Promise<Order> {
    const discounts = await this.createDiscountStrategies();
    if (discounts) {
      discounts.forEach(discount => {
        if (discount) this._order.addDiscountStrategy(discount);
      });
    }
    await this._order.executeDeliveryStrategy();
    await this._order.executeDiscountStrategies();
    await this._order.executePaymentStrategy();

    return this._order;
  }
}
