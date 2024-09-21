import axios from 'axios';
import * as yup from 'yup';
import 'yup-phone-lite';
import parsePhoneNumber from 'libphonenumber-js';

export const cartFormSchema = yup.object().shape({
  name: yup.string().required('name required_field'),
  phone: yup
    .string()
    .test('is_valid_phone', 'Invalid phone number', function (value) {
      if (!value) return false;
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (!phoneNumber) {
          throw new Error('Invalid phone number');
        }
        const countryCode = phoneNumber.country;
        return yup
          .string()
          .phone(countryCode, 'Invalid phone number')
          .isValidSync(value);
      } catch (error) {
        return false;
      }
    })
    .required('phone required_field'),
  do_not_call: yup.boolean(),
  delivery: yup
    .string()
    .matches(/(self|delivery)/)
    .required(),
  streetName: yup.string().when('delivery', {
    is: (value: string) => value === 'delivery',
    then: schema => schema.required('street name required_field'),
  }),
  streetId: yup.string().when('delivery', {
    is: (value: string) => value === 'delivery',
    then: schema => schema.required('street id required_field'),
  }),
  house: yup.string().when('delivery', {
    is: (value: string) => value === 'delivery',
    then: schema => schema.required('house required_field'),
    //   .test({
    //   test: async function (value, context) {
    //     const streetId = this.parent.streetId;
    //     const house = this.parent.house;
    //     try {
    //       const res = await axios
    //         .get<IGetDeliveryZoneByAddressResponse>(
    //           process.env.SERVER_URL ??
    //             '' + '/api/syrve/get-delivery-zone-by-address/',
    //           {
    //             params: {
    //               streetId,
    //               house,
    //             },
    //           }
    //         )
    //         .then(res => res.data);
    //       if (res.status !== 'ok') {
    //         context.createError({
    //           path: 'delivery.house',
    //           message: res.msg,
    //         });
    //         return false;
    //       }
    //       return true;
    //     } catch (error) {
    //       context.createError({
    //         path: 'delivery.house',
    //         message: 'house not found',
    //       });
    //     }
    //     return false;
    //   },
    // }),
  }),
  flat: yup.string(),
  floor: yup.string(),
  postcode: yup.string().when('delivery', {
    is: (value: string) => value === 'delivery',
    then: schema => schema.required('postcode required_field'),
  }),
  date: yup.string().required('date required_field'),
  time: yup.string().required('date required_field'),
  do_not_ring_doorbell: yup.boolean(),
  leave_by_the_door: yup.boolean(),
  payment: yup
    .string()
    .matches(/(cash|terminal|online)/)
    .required('payment required_field'),
  change: yup.string().when('payment', {
    is: (value: string) => value === 'cash',
    then: schema => schema.required('change required_field'),
  }),
  comment: yup.string(),
});
export interface ICartForm extends yup.InferType<typeof cartFormSchema> {
  // using interface instead of type generally gives nicer editor feedback
}

export default cartFormSchema;
