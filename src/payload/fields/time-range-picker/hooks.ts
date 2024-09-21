import { FieldHook } from 'payload/types';

export const fillWithNullIfEmptyHook: FieldHook<
  any,
  [string | null, string | null] | null
> = ({ value }) => {
  if (!value || !value[0] || !value[1]) return null;
  return value;
};
