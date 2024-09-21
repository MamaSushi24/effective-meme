import { SyrveAPIProvider } from '../../../services/api/syrve.api';
import { Endpoint, PayloadHandler } from 'payload/dist/config/types';
import * as yup from 'yup';
const validationSchema = yup.object().shape({
  streetId: yup.string().required(),
  house: yup.string().required(),
});
type TQuery = yup.InferType<typeof validationSchema>;

const validate: PayloadHandler = async (req, res, next) => {
  try {
    await validationSchema.validate(req.query, { abortEarly: false });
    next();
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      code: 'invalid_params',
      msg: err.message,
    });
    return;
  }
};

const handler: PayloadHandler = async (req, res, next) => {
  const qs = req.query as unknown as TQuery;
  const streetId = qs.streetId;
  const house = qs.house;
  try {
    const syrveAPI = SyrveAPIProvider.getInstance();
    const { isAllowed, allowedItems } =
      await syrveAPI.getDeliveryResctrictionsAllowed(streetId, house);
    if (!isAllowed) {
      return res.status(200).json({
        status: 'fail',
        code: 'delivery_address_not_allowed',
        result: {
          isAllowed,
        },
      });
    }
    const allowedDeliveryZone = allowedItems[0];
    // Predefined delivery service product id
    const ZONE_PRODUCT_ID = {
      'Delivery 1': 'dbe73c30-e16f-4f49-8879-6ab560e88add',
      'Delivery 2': 'c730d628-dd36-408f-bba5-5c0d8e8ff464',
      'Delivery 3': '8dce4211-7ecd-4950-97a6-61d05095730c',
    };
    const zoneName = allowedDeliveryZone.zone || '';
    const deliveryServiceProductId =
      allowedDeliveryZone.deliveryServiceProductId || ZONE_PRODUCT_ID[zoneName];

    if (!deliveryServiceProductId) {
      return res.status(200).json({
        status: 'fail',
        code: 'no_delivery_service_product_id',
      });
    }
    const nomenclature = await syrveAPI.getMenu({ startRevision: 0 });
    const productData = nomenclature.products.find(
      product => product.id === deliveryServiceProductId
    );
    if (!productData) {
      return res.status(200).json({
        status: 'fail',
        code: 'no_delivery_service_product_found_in_nomenclature',
      });
    }
    if (!productData.sizePrices || productData.sizePrices.length === 0) {
      return res.status(200).json({
        status: 'fail',
        code: 'no_delivery_service_product_price_found_in_nomenclature',
      });
    }

    const price = productData.sizePrices[0].price.currentPrice;
    res.status(200).json({
      status: 'ok',
      streetId,
      house,
      result: {
        isAllowed,
        zoneName: productData.name,
        zoneId: productData.id,
        price,
      },
    });
    return;
  } catch (err) {
    req.payload.logger.error(err, 'Could not get streets from Syrve API');
    res.status(500).json({
      status: 'fail',
      code: 'fail_get_delivery_restrictions_allowed',
      msg: 'internal server error',
    });
    return;
  }
};

const endpoint: Endpoint = {
  path: '/syrve/get-delivery-zone-by-address',
  method: 'get',
  handler: [validate, handler],
};
export interface IGetDeliveryZoneByAddressResponse {
  status: 'ok' | 'fail';
  result?: {
    isAllowed: boolean;
    zoneName?: string;
    zoneId?: string;
    price?: number;
  };
  code?: string;
  msg?: string;
}
export interface IGetDeliveryZoneByAddressRequest {
  streetId: string;
  house: string;
}
const endpointGetDeliveryZoneByAddress = endpoint;
export default endpointGetDeliveryZoneByAddress;
