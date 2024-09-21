'use server';
import { paths, components } from '../../types/syrve-types-autogen';
import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseApiProvider } from './base.api';
import {
  TGetAccessTokenRequest,
  TGetAccessTokenResponse,
  TGetMenuOptions,
  TGetMenuRequest,
  TGetMenuResponse,
  TPath,
} from '@/types/syrve-types';
import { PayloadAPI } from './payload-api/payload.api';
import NodeCache from 'node-cache';
// if (!process.env.SYRVE_API_URL) throw new Error('SYRVE_API_URL not set');
// if (!process.env.SYRVE_API_LOGIN) throw new Error('SYRVE_API_LOGIN not set');
// if (!process.env.SYRVE_ORGANIZATION_ID)
//   throw new Error('SYRVE_ORGANIZATION_ID not set');
export const apiConfig: AxiosRequestConfig = {
  withCredentials: true,
  timeout: 3000,
  baseURL: process.env.SYRVE_API_URL,
};

export class SyrveAPIProvider extends BaseApiProvider {
  private static instance: SyrveAPIProvider | null = null;
  private CacheProvider: NodeCache | null = null;
  accessToken: string;
  baseURL: string = process.env.SYRVE_API_URL as string;
  organizationID = process.env.SYRVE_ORGANIZATION_ID as string;
  terminalGroupID = process.env.SYRVE_TERMINAL_GROUP_ID as string;
  payload = new PayloadAPI();
  cityId = 'b090de0b-8550-6e17-70b2-bbba152bcbd3';
  readonly PAYMENT_TYPES = {
    CASH: '09322f46-578a-d210-add7-eec222a08871',
    CARD: 'e46b4e6c-10d5-a739-8fb1-b6674d1e65e7',
  };
  readonly DISCOUNT_TYPES = {
    SELF_DELIVERY: '1b42ea7f-3f7c-457a-8a09-b8d12eb6e88c',
  };
  private constructor() {
    super(apiConfig);
    this.accessToken = '';
    this.CacheProvider = new NodeCache({
      stdTTL: 60 * 15, // 15 minutes
    });
    this.fetcher.interceptors.request.use(
      async config => {
        this.accessToken = await this.getAccessToken();
        config.headers['Authorization'] = `Bearer ${this.accessToken}`
        config.headers['Timeout']= 25;
        return config;
      },
      (error: any) => {
        Promise.reject(error);
      }
    );
  }
  static getInstance() {
    if (!SyrveAPIProvider.instance) {
      SyrveAPIProvider.instance = new SyrveAPIProvider();
    }
    return SyrveAPIProvider.instance;
  }
  getAccessToken = async () => {
    const KEY = 'access_token';
    const cached = this.CacheProvider?.get<string>(KEY);
    if (cached) {
      return cached;
    }
    try {
      const res = await axios.post<
        TPath,
        AxiosResponse<TGetAccessTokenResponse, TGetAccessTokenRequest>,
        TGetAccessTokenRequest
      >(
        '/api/1/access_token' as TPath,
        {
          apiLogin: process.env.SYRVE_API_LOGIN as string,
        },
        {
          baseURL: this.baseURL,
        }
      );
      this.CacheProvider?.set(KEY, res.data.token, 60 * 5);
      return res.data.token;
    } catch (err) {
      throw new Error('Could not get access token');
    }
  };
  getMenu = async ({ startRevision }: TGetMenuOptions) => {
    const KEY = `getMenu`;
    const cached = this.CacheProvider?.get<TGetMenuResponse>(KEY);
    if (cached) {
      return cached;
    }
    try {
      const res = await this.post<TPath, TGetMenuRequest, TGetMenuResponse>(
        '/api/1/nomenclature',
        {
          organizationId: this.organizationID,
        }
      );
      this.CacheProvider?.set(KEY, res, 60 * 60);
      return res;
    } catch (err) {
      throw new Error('Could not get menu');
    }
  };
  createDelivery = async (data: ICreateDeliveryRequest['order']) => {
    return await this.post<
      TPath,
      ICreateDeliveryRequest,
      TCreateDeliveryResponse
    >('/api/1/deliveries/create', {
      organizationId: this.organizationID,
      terminalGroupId: this.terminalGroupID,
      order: data,
    });
  };
  getStreets = async () => {
    return await this.post<
      TPath,
      { organizationId: string; cityId: string; includeDeleted?: boolean },
      {
        correlationId: string;
        streets: {
          id: string;
          name: string;
          externalRevision: number;
          classifierId: string | null;
          isDeleted: boolean;
        }[];
      }
    >('/api/1/streets/by_city', {
      organizationId: this.organizationID,
      cityId: this.cityId,
      includeDeleted: false,
    });
  };
  getDeliveryResctrictionsAllowed = async (streetId: string, house: string) => {
    const KEY = `delivery_restrictions_allowed_${streetId}_${house}`;
    const cached =
      this.CacheProvider?.get<TGetAllowedRestrictionsResponse>(KEY);
    if (cached) {
      return cached;
    }
    const res = await this.post<
      TPath,
      TGetAllowedRestrictionsRequest,
      TGetAllowedRestrictionsResponse
    >('/api/1/delivery_restrictions/allowed', {
      organizationId: this.organizationID,
      isCourierDelivery: true,
      deliveryAddress: {
        city: this.cityId,
        streetId,
        house,
      },
    });
    this.CacheProvider?.set(KEY, res);
    return res;
  };
}
type TGetAllowedRestrictionsRequest =
  components['schemas']['iikoTransport.PublicApi.Contracts.DeliveryRestrictions.AllowedRestrictions.GetAllowedRestrictionsRequest'];
type TGetAllowedRestrictionsResponse =
  components['schemas']['iikoTransport.PublicApi.Contracts.DeliveryRestrictions.AllowedRestrictions.GetAllowedRestrictionsResponse'];
export enum OrderTypeID {
  DELIVERY = '76067ea3-356f-eb93-9d14-1fa00d082c4e',
  PICKUP = '5b1508f9-fe5b-d6af-cb8d-043af587d5c2',
}
export enum PaymentTypeID {
  CASH = '09322f46-578a-d210-add7-eec222a08871',
  TERMINAL = '2f82e7ed-0fe5-46f4-8a74-1b2190dced56',
  ONLINE = 'e041237c-5faf-4aee-9631-981559804fcc',
}
export enum PaymentTypeKind {
  CASH = 'Cash',
  TERMINAL = 'Card',
  ONLINE = 'Card',
}
export interface ICreateDeliveryRequest {
  organizationId: string;
  terminalGroupId: string;
  order: TCreateDeliveryPickupOrder | TCreateDeliveryByCurierOrder;
  completeBefore?: string | null;
}
type TCreateDeliveryOrder = {
  phone: string;
  orderTypeId: OrderTypeID;
  customer: {
    name: string;
    surname: '';
    email: '';
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
    price?: number;
  }[];
  discountsInfo?: {
    discounts: [
      {
        discountTypeId: string;
        type: 'RMS';
      },
    ];
  };
  loyaltyInfo?: {
    coupon: string | null;
    applicableManualConditions?: string[] | null;
  } | null;
  payments: [
    {
      sum: number;
      paymentTypeKind: PaymentTypeKind;
      paymentTypeId: PaymentTypeID;
      // isProcessedExternally: boolean;
    },
  ];
  completeBefore?: string | null;
};
export type TCreateDeliveryPickupOrder = {
  orderTypeId: OrderTypeID.PICKUP;
} & TCreateDeliveryOrder;
export type TCreateDeliveryByCurierOrder = {
  orderTypeId: OrderTypeID.DELIVERY;
  deliveryPoint: {
    address: {
      street: {
        id: string | null;
        name: string;
      };
      index?: string | null;
      house: string;
      flat: string | null;
      entrance: string | null;
      floor: string | null;
    };
    comment: string | null;
  };
} & TCreateDeliveryOrder;

type TCreateDeliveryResponse = {
  correlationId: string;
  orderInfo: {
    id: string;
    posId: string;
    externalNumber: null;
    organizationId: string;
    timestamp: number;
    creationStatus: 'Success' | 'InProgress' | 'Error';
    errorInfo: null | {
      code: string;
      message: string | null;
    };
    order: null | Object;
  };
};
