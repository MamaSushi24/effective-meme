export interface Nomenclature {
  correlationId: string;
  groups: ProductsGroupInfo[];
  productCategories: ProductCategoryInfo[];
  products: ProductInfo[];
  revision: number;
}
export interface ProductsGroupInfo {
  imageLinks: string[];
  parentGroup: string;
  order: number;
  isIncludedInMenu: boolean;
  isGroupModifier: boolean;
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  tags: string[] | null;
  isDeleted: boolean;
  seoDescription: string | null;
  seoText: string | null;
  seoKeywords: string | null;
  seoTitle: string | null;
}
export interface ProductCategoryInfo {
  id: string;
  name: string;
  isDeleted: boolean;
}
export interface ProductInfo {
  fatAmount: number | null;
  proteinsAmount: number | null;
  carbohydratesAmount: number | null;
  energyAmount: number | null;
  fatFullAmount: number | null;
  proteinsFullAmount: number | null;
  carbohydratesFullAmount: number | null;
  energyFullAmount: number | null;
  weight: number | null;
  groupId: string | null;
  productCategoryId: string | null;
  type: 'Dish' | 'Good' | 'Modifier' | null;
  orderItemType: string | 'Product' | 'Compound';
  modifierSchemaId: string | null;
  modifierSchemaName: string | null;
  splittable: boolean;
  measureUnit: string;
  sizePrices: SizePrice[];
  modifiers: SimpleModifierInfo[];
  groupModifiers: GroupModifierInfo[];
  imageLinks: string[];
  doNotPrintInCheque: boolean;
  parentGroup: string;
  order: number;
  fullNameEnglish: string | null;
  useBalanceForSell: boolean;
  canSetOpenPrice: boolean;
  paymentSubject: string | null;
  id: string;
  code: string | null;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  tags: string[] | null;
  isDeleted: boolean;
  seoDescription: string | null;
  seoText: string | null;
  seoKeywords: string | null;
  seoTitle: string | null;
  sizes: Size[];
  revision: number;
}
export interface SizePrice {
  sizeId: string;
  price: {
    currentPrice: number;
    isIncludedInMenu: boolean;
    nextPrice: number | null;
    nextIncludedInMenu: boolean;
    nextDatePrice: string | null;
  };
}
export interface SimpleModifierInfo {
  id: string;
  defaultAmount: number | null;
  minAmount: number;
  maxAmount: number;
  required: boolean | null;
  hideIfDefaultAmount: boolean | null;
  splittable: boolean | null;
  freeOfChargeAmount: number | null;
}
export interface GroupModifierInfo {
  id: string;
  minAmount: number;
  maxAmount: number;
  required: boolean | null;
  childModifiersHaveMinMaxRestrictions: boolean | null;
  childModifiers: ChildModifierInfo[];
  hideIfDefaultAmount: boolean | null;
  defaultAmount: number | null;
  splittable: boolean | null;
  freeOfChargeAmount: number | null;
}
export interface ChildModifierInfo {
  id: string;
  defaultAmount: number | null;
  minAmount: number;
  maxAmount: number;
  required: boolean | null;
  hideIfDefaultAmount: boolean | null;
  splittable: boolean | null;
  freeOfChargeAmount: number | null;
}
export interface Size {
  id: string;
  name: string;
  priority: number | null;
  isDefault: boolean;
}

// export namespace SyrveAPI {
//   namespace Delivery {
//     namespace Rescrictions {
//       interface ListRequest {
//         organizationId: string;
//       }
//       interface ListResponse {
//         correlationId: string;
//         deliveryRestrictions: DeliveryRestriction[];
//       }
//       interface DeliveryRestriction {
//         organizationId: string;
//         deliveryGeocodeServiceType: number;
//         deliveryRegionsMapUrl: string | null;
//         defaultDeliveryDurationInMinutes: number;
//         defaultSelfServiceDurationInMinutes: number;
//         useSameDeliveryDuration: boolean;
//         useSameMinSum: boolean;
//         defaultMinSum: number | null;
//         useSameWorkTimeInterval: boolean;
//         defaultFrom: number | null;
//         defaultTo: number | null;
//         useSameRestrictionsOnAllWeek: boolean;
//         restrictions: DeliveryRestrictionItem[];
//         deliveryZones: DeliveryZone[];
//         rejectOnGeocodingError: boolean;
//         addDeliveryServiceCost: boolean;
//         useSameDeliveryServiceProduct: boolean;
//         defaultDeliveryServiceProductId: string | null;
//         useExternalAssignationService: boolean;
//         frontTrustsCallCenterCheck: boolean;
//         externalAssignationServiceUrl: string | null;
//         requireExactAddressForGeocoding: boolean;
//         zonesMode: 0 | 1 | 2;
//         autoAssignExternalDeliveries: boolean;
//         actionOnValidationRejection: 1 | 2;
//       }
//       interface DeliveryRestrictionItem {
//         minSum: number | null;
//         terminalGroupId: string | null;
//         organizationId: string | null;
//         zone: string;
//         weekMap: number;
//         from: number | null;
//         to: number | null;
//         priority: number;
//         deliveryDurationInMinutes: number;
//         deliveryServiceProductId: number | null;
//       }
//       interface DeliveryZone {
//         name: string;
//         coordinates: Coordinates[];
//         addresses: DeliveryZoneAddressBinding[];
//       }
//       interface Coordinates {
//         latitude: number;
//         longitude: number;
//       }
//       interface DeliveryZoneAddressBinding {
//         streetId: string;
//         postcode: string;
//         houses: {
//           type: 0 | 1 | 2 | 3;
//           startingNumber: number;
//           maxNumber: number;
//           isUnlimitedRange: boolean;
//           specificNumbers: string[];
//         };
//       }
//     }

//     namespace Addresses {
//       interface StreetsByCityRequest {
//         organizationId: string;
//         cityId: string;
//         includeDeleted?: boolean;
//       }
//       interface StreetsByCityResponse {
//         correlationId: string;
//         streets: Street[];
//       }
//       interface Street {
//         id: string;
//         name: string;
//         externalRevision: number | null;
//         classifierId: string | null;
//         isDeleted: boolean;
//       }
//     }
//   }
// }
