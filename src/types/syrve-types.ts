import { components, paths } from './syrve-types-autogen';
export type TPath = keyof paths;
export type TOrderItem =
  components['schemas']['iikoTransport.PublicApi.Contracts.Deliveries.Request.CreateOrder.OrderItem'];
export type TOrderItemProduct = {
  productId: string;
  type: 'Product';
  price: number;
  amount: number;
};

export type TGetAccessTokenResponse =
  components['schemas']['iikoTransport.PublicApi.Contracts.Auth.GetAccessTokenResponse'];
export type TGetAccessTokenRequest =
  components['schemas']['iikoTransport.PublicApi.Contracts.Auth.GetAccessTokenRequest'];

export type TGetMenuOptions = {
  startRevision?: number | null;
};
export type TGetMenuRequest =
  components['schemas']['iikoTransport.PublicApi.Contracts.Nomenclature.NomenclatureRequest'];
export type TGetMenuResponse =
  paths['/api/1/nomenclature']['post']['responses']['200']['content']['application/json'];

export type TCreateDeliveryOptions =
  | ICreateDeliveryOptionsDeliveryByClient
  | ICreateDeliveryOptionsDeliveryByCourier;
interface ICreateDelivery {
  customer: {
    phone: TCreateDeliveryRequest['order']['phone'];
    name: string;
  };
  items: {
    type: 'Product';
    data: {
      productId: string;
      price: number;
      amount: number;
    };
  }[];
  comment?: TCreateDeliveryRequest['order']['comment'];
  payment: {
    type: 'CASH' | 'CARD' | 'ONLINE';
    sum: number;
  };
  guestsCount: number;
}
interface ICreateDeliveryOptionsDeliveryByClient extends ICreateDelivery {
  orderServiceType: 'DeliveryByClient';
}
interface ICreateDeliveryOptionsDeliveryByCourier extends ICreateDelivery {
  orderServiceType: 'DeliveryByCourier';
  delivery: {
    completeBefore: TCreateDeliveryRequest['order']['completeBefore'];
    address: {
      street: string;
      house: string;
      flat?: string;
      floor?: string;
    };
  };
}
export type TCreateDeliveryRequest =
  components['schemas']['iikoTransport.PublicApi.Contracts.Deliveries.Request.CreateOrderRequest'];
export type TCreateDeliveryResponse =
  components['schemas']['iikoTransport.PublicApi.Contracts.Deliveries.Request.CreateOrderRequest'];
export type TDeliveryOrder =
  components['schemas']['iikoTransport.PublicApi.Contracts.Deliveries.Request.CreateOrder.DeliveryOrder'];
export type TAnonymousCustomer =
  components['schemas']['iikoTransport.PublicApi.Contracts.Deliveries.Response.Order.AnonymousCustomer'];

export interface ICreateSelfDeliveryDTO {
  organizationId: string;
  terminalGroupId: string;

  order: {
    phone: string;
    orderTypeId: string;
    customer: {
      name: string;
      surname: string;
      email: string;
    };
    comment: string;
    guests: {
      count: number;
      splitBetweenPersons: false;
    };
    items: {
      type: 'Product';
      productId: string;
      amount: number;
      modifiers: [];
    }[];
    discountsInfo: {
      discounts:
        | {
            discountTypeId: string;
            type: 'RMS';
          }[]
        | null;
    } | null;
    paymentItems: {
      sum: number;
      paymentTypeKind: string;
      paymentTypeId: string;
      isProcessedExternally: boolean;
    }[];
  };
}
