import { Config, Product } from '@/types/payload-types';
import { Nomenclature } from '@/types/syrve-api';
import { Payload } from 'payload/dist/payload';
import { CollectionBeforeValidateHook } from 'payload/types';
import slugify from 'slugify';
export const checkIfSlugIsUnique = async (
  collection: keyof Config['collections'],
  slug: string,
  payload: Payload
) => {
  const existData = await payload
    .find({
      collection,
      where: {
        slug: {
          equals: slug,
        },
      },
    })
    .then(res => res.docs);
  if (existData.length > 0) return false;
  return true;
};
const autoFillFieldsFromCRM: CollectionBeforeValidateHook<Product> = async ({
  data, // incoming data to update or create with
  operation, // name of the operation ie. 'create', 'update'
  req, // express request object
  originalDoc,
}) => {
  const modifiedData = JSON.parse(JSON.stringify(data)) as Product & {
    syrveData: Nomenclature['products'][0];
  };

  if (data?.syrveData) {
    const syrveData = (
      typeof data.syrveData === 'string'
        ? JSON.parse(data.syrveData)
        : data.syrveData
    ) as Nomenclature['products'][0];
    if (operation === 'create') {
      modifiedData.id = syrveData.id;
      modifiedData.name = syrveData.name;
      let formatedSlug = slugify(syrveData.name, { lower: true });
      if (!req?.payload) throw new Error('Payload is not defined');
      const isSlugUnique = await checkIfSlugIsUnique(
        'products',
        formatedSlug,
        req?.payload
      );
      if (!isSlugUnique) formatedSlug = `${formatedSlug}-${syrveData.id}`;
      modifiedData.slug = formatedSlug;
      modifiedData.parentGroup = syrveData.parentGroup;
    }
    if (operation === 'update') {
      if (
        syrveData.parentGroup &&
        syrveData.parentGroup !== originalDoc?.parentGroup
      ) {
        modifiedData.parentGroup = syrveData.parentGroup;
        req?.payload.logger.info(
          `Product ${originalDoc?.id} updated parentGroup from ${originalDoc?.parentGroup} to ${syrveData.parentGroup}`
        );
      }
    }
  }

  if (operation === 'update') {
    if (data?.slug) modifiedData.slug = slugify(data.slug, { lower: true });
  }
  return modifiedData;
};
export default autoFillFieldsFromCRM;
