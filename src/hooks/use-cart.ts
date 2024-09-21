import { DiscountsCode, Order, Product } from '@/types/payload-types';
import {
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { singletonHook } from 'react-singleton-hook';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import axios from 'axios';
import { DEFAULT_LOCALE } from '@/consts/locales';
import { request, gql } from 'graphql-request';
import { TCheckoutBody } from '@/payload/collections/Orders/endpoints/checkout';
import { useLocalStorage } from 'usehooks-ts';
import { IGetDeliveryZoneByAddressResponse } from '@/payload/endpoints/syrve/get-delivery-zone-by-address';
import {
  CalculateOrderRequestBody,
  TCalculateOrderResponse,
} from '@/payload/endpoints/order/calculate';
import { DeliveryStrategyType, PaymentType } from '@/modules/cart/types';
import ILineItem, { LineItemType } from '@/modules/cart/CartLine/ILineItem';

export interface Cart {
  items: CartItem[];
  discountMoney: number;
  totalPrice: number;
  quantity: number;
  loading: boolean;
  minOrderPrice: number;
  deliveryPrice: number;
  totalPriceWithDiscount: number;
  freeDeliveryPrice: number;
  inititalState: boolean;
  applyDiscountCode: (code: string) => Promise<{
    status: 'ok' | 'fail';
    error?: string;
  }>;
  cleanCart: () => void;
  cartDispatch: React.Dispatch<ICartAction>;
  cartState: ICart;
  orderNumber?: string;
  setOrderNumber: (orderNumber: string) => void;
  placeOrder: () => Promise<any>;
  addProductToCart: (productID: string, quantity: number) => void;
  storedOrder: {
    orderId: string;
    status: 'paid' | 'pending' | 'canceled';
    orderNumber: string;
  } | null;
  saveOrderInStore: (
    order: {
      orderId: string;
      status: 'paid' | 'pending' | 'canceled';
      orderNumber: string;
    } | null
  ) => void;
  verifyOrderStatusData:
    | {
        orderId: string;
        status: Order['payment']['status'];
        total: number;
        order: Order;
      }
    | null
    | undefined;
  discountCode?: string;
  discountStrategiesApplied: { id: string; title: string }[];
}
export interface CartItem
  extends Omit<ILineItem, 'discountAllocations' | 'applyDiscount' | 'toJSON'> {
  productID: Product['id'];
  quantity: number;
  productData: TProductData;
}
type TProductData = Pick<
  Product,
  | 'id'
  | 'name'
  | 'price'
  | 'slug'
  | 'cardImage'
  | 'quantity'
  | 'parentGroup'
  | 'nameSyrve'
  | 'availableOnlyForSpecifiedDays'
  | 'aviabilityDays'
>;

const CART_INITIAL_STATE: ICart = {
  customer: {
    name: '',
    phone: '+48',
  },
  items: [],
  delivery: {
    type: 'delivery',
  },
  payment: {
    type: 'cash',
  },
  comments: {},
  numberOfPeople: 1,
  numberOfSticksWithHelper: 0,
};
const initialState: Cart = {
  items: [],
  discountMoney: 0,
  totalPrice: 0,
  deliveryPrice: 0,
  quantity: 0,
  minOrderPrice: 0,
  totalPriceWithDiscount: 0,
  freeDeliveryPrice: 0,
  loading: false,
  inititalState: true,
  applyDiscountCode: async () => {
    return {
      status: 'fail',
    };
  },
  setOrderNumber: () => {},
  cleanCart: () => {},
  placeOrder: async () => {},
  addProductToCart: () => {},
  cartDispatch: () => {},
  cartState: CART_INITIAL_STATE,
  storedOrder: null,
  saveOrderInStore: () => {},
  verifyOrderStatusData: null,
  discountStrategiesApplied: [],
};
const QUERY = gql`
  query {
    GlobalSetting {
      delivery {
        freeDeliveryPrice
        selfDeliveryDiscount
        minOrderPrice
      }
    }
  }
`;
const useCartImpl = (): Cart => {
  const [storedOrder, saveOrderInStore] = useLocalStorage<{
    orderId: string;
    status: 'paid' | 'pending' | 'canceled';
    orderNumber: string;
  } | null>('order', null);
  const [orderNumber, setOrderNumber] = useState<string | undefined>();
  const {
    data: verifyOrderStatusData,
    isLoading: verifyOrderStatusLoading,
    isValidating: isVerifyOrderValidating,
  } = useSWR(
    {
      url:
        process.env.NEXT_PUBLIC_SERVER_URL +
        '/api/orders/status/' +
        storedOrder?.orderId,
      orderId: storedOrder?.orderId,
    },
    ({ url, orderId }) => {
      if (!orderId) return null;

      return axios
        .get<{
          orderId: string;
          status: 'paid' | 'pending' | 'canceled';
          total: number;
          order: Order;
        }>(url)
        .then(res => res.data)
        .catch(() => {
          saveOrderInStore(null);
          return null;
        });
    },
    {
      refreshInterval: 500,
    }
  );
  const router = useRouter();
  const locale = router.locale ?? DEFAULT_LOCALE;
  const [cart, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  const { data: calculatedOrder, isLoading: isLoadingCalculatedOrder } = useSWR(
    {
      url:
        process.env.NEXT_PUBLIC_SERVER_URL + '/api/order/calculate/' + locale,
      body: cart,
      // lang: locale,
    },
    async ({ url, body }) => {
      let comment = '';
      if (body.comments) {
        const commentKeys = Object.keys(body.comments);
        comment = commentKeys.reduce((acc, key) => {
          if (body.comments[key as COMMENT_KEYS])
            return `${acc}${formatComment(
              key as COMMENT_KEYS,
              body.comments[key as COMMENT_KEYS]
            )}`;
          return acc;
        }, '');
      }
      const getDelivery = (): CalculateOrderRequestBody['delivery'] => {
        if (body.delivery.type === 'self') {
          return {
            type: DeliveryStrategyType.PICKUP,
            comment: comment,
            // @ts-expect-error
            address: null,
          };
        }
        if (body.delivery.type === 'delivery') {
          if (!body.delivery.streetId)
            return {
              // @ts-expect-error
              type: undefined,
              comment: comment,
            };
          return {
            type: DeliveryStrategyType.DELIVERY_BY_COURIER,
            address: {
              street: {
                id: body.delivery.streetId,
                name: body.delivery.streetName as string,
              },
              house: body.delivery.house as string,
              flat: body.delivery.flat,
              // entrance: '',
              floor: body.delivery.floor,
            },
          };
        }
        return {
          // @ts-expect-error
          type: undefined,
          comment: comment,
        };
      };
      const getPaymentType = () => {
        if (body.payment.type === 'cash') return PaymentType.CASH;
        if (body.payment.type === 'terminal') return PaymentType.CARD;
        if (body.payment.type === 'online') return PaymentType.ONLINE;
        return PaymentType.CASH;
      };
      const paymentType = getPaymentType();

      const requestBody: CalculateOrderRequestBody = {
        customerName: body.customer.name,
        delivery: getDelivery(),
        payment: {
          type: paymentType,
        },
        lines: body.items.map(item => ({
          productId: item.productID,
          quantity: item.quantity,
        })),
        phone: body.customer.phone,
        discountCode: body.discount?.code ?? null,
      };
      return await axios
        .post<TCalculateOrderResponse>(url, requestBody)
        .then(res => res.data);
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
      refreshInterval: 500000,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { data, isLoading } = useSWR(
    {
      url: process.env.NEXT_PUBLIC_SERVER_URL + '/api/graphql',
      query: QUERY,
    },
    ({ url, query }) =>
      request<{
        GlobalSetting: {
          delivery: {
            freeDeliveryPrice: number;
            selfDeliveryDiscount: number;
            minOrderPrice: number;
          };
        };
      }>(url, query)
  );
  const {
    data: deliveryZoneData,
    isLoading: isDeliveryZoneLoading,
    error: errorDeliveryZone,
  } = useSWR(
    {
      url:
        process.env.NEXT_PUBLIC_SERVER_URL +
        '/api/syrve/get-delivery-zone-by-address',
      streetId: cart.delivery.streetId,
      house: cart.delivery.house,
      deliveryType: cart.delivery.type,
    },
    ({ url, streetId, house, deliveryType }) => {
      if (deliveryType === 'self') return null;
      if (!streetId || !house) {
        throw new Error(
          'error_when_getting_delivery_zone_by_address: streetId or house is empty'
        );
      }
      return axios
        .get<IGetDeliveryZoneByAddressResponse>(url, {
          params: {
            streetId,
            house,
          },
        })
        .then(res => res.data);
    }
  );

  // Apply discount code
  const applyDiscountCode: Cart['applyDiscountCode'] = useCallback(
    async (code: string) => {
      try {
        const response = await axios.get<{
          discount: DiscountsCode;
          status: 'ok' | 'fail';
          error?: string;
        }>(
          process.env.NEXT_PUBLIC_SERVER_URL +
            `/api/discounts-codes/check/${code}`,
          {
            params: {
              phone: cart.customer.phone,
            },
          }
        );

        if (response.data.status === 'ok') {
          const { discount } = response.data;
          dispatch({
            type: 'APPLY_DISCOUNT_CODE',
            payload: discount,
          });
          return {
            status: 'ok',
          };
        } else {
          console.error('Invalid discount code');
          dispatch({
            type: 'APPLY_DISCOUNT_CODE',
            payload: null,
          });
          return {
            status: 'fail',
            error: response.data.error,
          };
        }
      } catch (error) {
        console.error('Error applying discount code:', error);
        dispatch({
          type: 'APPLY_DISCOUNT_CODE',
          payload: null,
        });
        return {
          status: 'fail',
        };
      }
    },
    [cart.customer.phone]
  );

  // Clean cart
  const cleanCart = useCallback(() => {
    dispatch({
      type: 'CLEAR_CART',
    });
    setOrderNumber(undefined);
  }, []);

  // Place order
  const placeOrder = async (): Promise<{
    status: 'ok' | 'fail';
    order?: Order;
    code?: string;
  }> => {
    try {
      setIsPlacingOrder(true);
      const res = await axios.post<
        TCheckoutBody,
        {
          data: {
            status: 'ok' | 'fail';
            order: Order;
          };
        }
      >(process.env.NEXT_PUBLIC_SERVER_URL + '/api/orders/checkout', {
        ...cart,
        discountPercent: cart.discount?.percent ?? 0,
      });

      return res.data;
    } catch (error) {
      console.error('Error placing order:', error);
      return {
        status: 'fail',
        code: error?.response?.data?.code,
      };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Add product to cart
  const addProductToCart = useCallback(
    (productID: string, quantity: number) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          productID,
          quantity,
        },
      });

      // Fire FB event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart');
      }
    },
    []
  );
  // Computed properties
  const freeDeliveryPrice =
    data?.GlobalSetting?.delivery?.freeDeliveryPrice ?? 0;

  const cartItemsWithDetails: CartItem[] = useMemo(() => {
    if (!calculatedOrder?.lines) return [];
    const res: CartItem[] = calculatedOrder.lines.map(line => {
      return {
        productData: {
          id: line.product.id,
          name: line.product.name,
          price: line.product.price / 100,
          slug: line.product.slug,
          cardImage: line.product.featuredImage,
          quantity: line.product.description,
          parentGroup: line.product.parentGroup,
          nameSyrve: line.product.nameSyrve,
          availableOnlyForSpecifiedDays:
            line.product.availableOnlyForSpecifiedDays,
          aviabilityDays: line.product.aviabilityDays,
        },
        productID: line.product.id,
        quantity: line.quantity,
        type: line.type,
        finalLinePrice: line.finalLinePrice / 100,
        originalLinePrice: line.originalLinePrice / 100,
        finalPrice: line.finalPrice / 100,
        title: line.title,
        totalDiscount: line.totalDiscount / 100,
        originalPrice: line.originalPrice / 100,
        productId: line.productId,
        product: line.product,
        url: line.url,
      };
    });
    return res;
  }, [calculatedOrder?.lines]);

  const totalPrice = useMemo(() => {
    if (!calculatedOrder?.originalTotalPrice) return 0;
    return calculatedOrder.originalTotalPrice / 100;
  }, [calculatedOrder?.originalTotalPrice]);
  const discountMoney = useMemo(() => {
    if (!calculatedOrder?.totalDiscount) return 0;
    return calculatedOrder.totalDiscount / 100;
  }, [calculatedOrder?.totalDiscount]);

  const computedDeliveryPrice = useMemo(() => {
    // find shipping line item in calculated order lines
    const shippingLine = calculatedOrder?.lines?.find(
      line => line.type === LineItemType.SHIPPING_LINE
    );
    if (!shippingLine) return 0;
    return shippingLine.finalLinePrice / 100;
  }, [calculatedOrder?.lines]);

  const totalPriceWithDiscount = useMemo(() => {
    if (!calculatedOrder?.totalPrice) return 0;
    return calculatedOrder.totalPrice / 100;
  }, [calculatedOrder?.totalPrice]);
  const quantity = !calculatedOrder?.totalQuantity
    ? 0
    : calculatedOrder.totalQuantity;
  return {
    items: cartItemsWithDetails,
    totalPrice,
    discountMoney,
    discountCode: cart.discount?.code,
    deliveryPrice: computedDeliveryPrice,
    totalPriceWithDiscount,
    quantity,
    cleanCart,
    addProductToCart,
    placeOrder,
    applyDiscountCode,
    orderNumber,
    setOrderNumber,
    minOrderPrice:
      data?.GlobalSetting?.delivery?.minOrderPrice ??
      initialState.minOrderPrice,
    freeDeliveryPrice:
      data?.GlobalSetting?.delivery?.freeDeliveryPrice ??
      initialState.freeDeliveryPrice,
    loading:
      isLoading ||
      isLoadingCalculatedOrder ||
      isDeliveryZoneLoading ||
      isPlacingOrder ||
      (Boolean(storedOrder) && !verifyOrderStatusData),
    inititalState: false,
    cartDispatch: dispatch,
    cartState: cart,
    storedOrder,
    saveOrderInStore,
    verifyOrderStatusData,
    discountStrategiesApplied: calculatedOrder?.discountStrategiesApplied ?? [],
  };
};

export interface ICart {
  customer: Order['customer'];
  items: {
    productID: string;
    quantity: number;
  }[];
  delivery: Pick<
    Order['delivery'],
    | 'type'
    | 'streetName'
    | 'streetId'
    | 'house'
    | 'flat'
    | 'floor'
    | 'postcode'
    | 'date'
    | 'time'
  > & {
    address?: string;
  };
  payment: Pick<Order['payment'], 'type'>;
  discount?: DiscountsCode;
  comments: Partial<{
    [key in COMMENT_KEYS]: string;
  }>;
  numberOfPeople: number;
  numberOfSticksWithHelper: number;
}
export enum COMMENT_KEYS {
  NUMBER_OF_STICKS = 'NUMBER_OF_STICKS',
  NUMBER_OF_STICKS_WITH_HELPER = 'NUMBER_OF_STICKS_WITH_HELPER',
  DO_NOT_CALL = 'DO_NOT_CALL',
  DO_NOT_RING_DOORBELL = 'DO_NOT_RING_DOORBELL',
  LEAVE_BY_DOOR = 'LEAVE_BY_DOOR',
  PREPARE_CHANGE = 'PREPARE_CHANGE',
  CLIENT_COMMENT = 'CLIENT_COMMENT',
}
type TActionAddItem = {
  type: 'ADD_ITEM';
  payload: {
    productID: string;
    quantity: number;
  };
};
type TActionRemoveItem = {
  type: 'REMOVE_ITEM';
  payload: {
    productID: string;
  };
};
type TActionSetItemQuantity = {
  type: 'SET_ITEM_QUANTITY';
  payload: {
    productID: string;
    quantity: number;
  };
};
type TActionIncrementQuantity = {
  type: 'INCREMENT_QUANTITY';
  payload: {
    productID: string;
  };
};
type TActionDecrementQuantity = {
  type: 'DECREMENT_QUANTITY';
  payload: {
    productID: string;
  };
};
type TActionClearCart = {
  type: 'CLEAR_CART';
};
type TActionApplyDiscountCode = {
  type: 'APPLY_DISCOUNT_CODE';
  payload: DiscountsCode | null;
};
type TActionSetNumberOfPeople = {
  type: 'SET_NUMBER_OF_PEOPLE';
  payload: {
    quantity: number;
  };
};
type TActionSetNumberOfSticksWithHelper = {
  type: 'SET_NUMBER_OF_STICKS_WITH_HELPER';
  payload: {
    quantity: number;
  };
};
type TActionSetComment = {
  type: 'SET_COMMENT';
  payload: {
    key: keyof ICart['comments'];
    value: any;
  };
};
type TActionSetCustomer = {
  type: 'SET_CUSTOMER';
  payload: {
    name: string;
    phone: string;
  };
};
type TActionSetDelivery = {
  type: 'SET_DELIVERY';
  payload: ICart['delivery'];
};
type TActionSetPayment = {
  type: 'SET_PAYMENT';
  payload: Pick<ICart['payment'], 'type'>;
};
type ICartAction =
  | TActionAddItem
  | TActionRemoveItem
  | TActionDecrementQuantity
  | TActionIncrementQuantity
  | TActionSetItemQuantity
  | TActionClearCart
  | TActionApplyDiscountCode
  | TActionSetNumberOfPeople
  | TActionSetNumberOfSticksWithHelper
  | TActionSetComment
  | TActionSetCustomer
  | TActionSetDelivery
  | TActionSetPayment;
function cartReducer(state: ICart, action: ICartAction) {
  switch (action.type) {
    case 'ADD_ITEM':
      const checkIfItemExists = state.items.find(
        item => item.productID === action.payload.productID
      );
      if (checkIfItemExists) {
        return {
          ...state,
          items: state.items.map(item => {
            if (item.productID === action.payload.productID) {
              return {
                ...item,
                quantity: item.quantity + action.payload.quantity,
              };
            }
            return item;
          }),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            productID: action.payload.productID,
            quantity: action.payload.quantity,
          },
        ],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          item => item.productID !== action.payload.productID
        ),
      };
    case 'INCREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.productID === action.payload.productID) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }),
      };
    case 'DECREMENT_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.productID === action.payload.productID) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        }),
      };
    case 'SET_ITEM_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.productID === action.payload.productID) {
            return {
              ...item,
              quantity: action.payload.quantity,
            };
          }
          return item;
        }),
      };
    case 'CLEAR_CART':
      return {
        ...CART_INITIAL_STATE,
      };
    case 'SET_PAYMENT':
      return {
        ...state,
        payment: {
          ...action.payload,
        },
      };
    case 'APPLY_DISCOUNT_CODE':
      if (!action.payload) {
        return {
          ...state,
          discount: undefined,
        };
      }
      return {
        ...state,
        discount: {
          ...action.payload,
        },
      };
    case 'SET_NUMBER_OF_PEOPLE': {
      const KEY = COMMENT_KEYS.NUMBER_OF_STICKS;
      const formattedComment = formatComment(KEY, action.payload.quantity);
      return {
        ...state,
        numberOfPeople: action.payload.quantity,
        comments: {
          ...state.comments,
          [COMMENT_KEYS.NUMBER_OF_STICKS]: formattedComment,
        },
      };
    }
    case 'SET_NUMBER_OF_STICKS_WITH_HELPER': {
      const KEY = COMMENT_KEYS.NUMBER_OF_STICKS_WITH_HELPER;
      const formattedComment = formatComment(KEY, action.payload.quantity);
      return {
        ...state,
        numberOfSticksWithHelper: action.payload.quantity,
        comments: {
          ...state.comments,
          [COMMENT_KEYS.NUMBER_OF_STICKS_WITH_HELPER]: formattedComment,
        },
      };
    }
    case 'SET_COMMENT':
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.key]: formatComment(
            action.payload.key,
            action.payload.value
          ),
        },
      };
    case 'SET_CUSTOMER':
      return {
        ...state,
        customer: {
          name: action.payload.name,
          phone: action.payload.phone,
        },
      };
    case 'SET_DELIVERY':
      if (action.payload.type === 'self') {
        return {
          ...state,
          delivery: {
            ...action.payload,
            address: undefined,
          },
        };
      }
      return {
        ...state,
        delivery: {
          ...action.payload,
        },
        discount: undefined,
      };
    default:
      return state;
  }
}
function formatComment(key: keyof ICart['comments'], value: any) {
  switch (key) {
    case COMMENT_KEYS.NUMBER_OF_STICKS:
      return `Liczba patyczków: ${value}`;
    case COMMENT_KEYS.NUMBER_OF_STICKS_WITH_HELPER:
      return `Liczba patyczków z pomocnikiem: ${value}`;
    case COMMENT_KEYS.DO_NOT_CALL:
      if (value) {
        return 'Nie dzwonić';
      }
      return null;
    case COMMENT_KEYS.DO_NOT_RING_DOORBELL:
      if (value) {
        return 'Nie dzwonić do drzwi';
      }
      return null;
    case COMMENT_KEYS.LEAVE_BY_DOOR:
      if (value) {
        return 'Zostawić przy drzwiach';
      }
      return null;
    case COMMENT_KEYS.PREPARE_CHANGE:
      if (value) {
        return `Przygotować resztę z ${value} złotych.`;
      }
      return null;
    case COMMENT_KEYS.CLIENT_COMMENT:
      return `Komentarz klienta:\n${value}`;
    default:
      return value;
  }
}
export default singletonHook(initialState, useCartImpl);
