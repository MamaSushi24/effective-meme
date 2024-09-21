import { Config, Group } from '@/types/payload-types';
import { Nomenclature } from '@/types/syrve-api';
import { CollectionBeforeValidateHook } from 'payload/types';
import slugify from 'slugify';
import { checkIfSlugIsUnique } from '../../Products/hooks/autoFillFieldsFromCRM';

const autoFillFieldsFromCRM: CollectionBeforeValidateHook = async ({
  data, // incoming data to update or create with
  operation, // name of the operation ie. 'create', 'update'
  req,
}) => {
  const modifiedData = JSON.parse(JSON.stringify(data)) as Group & {
    syrveData: Nomenclature['groups'][0];
  };
  if (data?.syrveData) {
    const syrveData = data.syrveData as Nomenclature['groups'][0];
    if (operation === 'create') {
      modifiedData.id = syrveData.id;
      modifiedData.name = syrveData.name;
      let formatedSlug = slugify(syrveData.name, { lower: true });
      if (!req?.payload) throw new Error('Payload is not defined');
      const isSlugUnique = await checkIfSlugIsUnique(
        'groups',
        formatedSlug,
        req?.payload
      );
      if (!isSlugUnique) formatedSlug = `${formatedSlug}-${syrveData.id}`;
      modifiedData.slug = formatedSlug;
    }
    if (operation === 'update') {
      if (data.slug) modifiedData.slug = slugify(data.slug, { lower: true });
    }
  }
  return modifiedData; // Return data to either create or update a document with
};
export default autoFillFieldsFromCRM;
