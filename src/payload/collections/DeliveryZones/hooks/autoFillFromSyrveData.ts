import { CollectionBeforeValidateHook } from 'payload/types';

interface SyrveData {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
}
const autoFillFromSyrveData: CollectionBeforeValidateHook = async ({
  data, // incoming data to update or create with
  operation, // name of the operation ie. 'create', 'update'
  req, // express request object
  originalDoc,
}) => {
  return data;
};
export default autoFillFromSyrveData;
