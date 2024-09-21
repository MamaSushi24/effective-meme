import { JSONField } from 'payload/dist/fields/config/types';
import TimeRangePickerField from './component-field';
import { fillWithNullIfEmptyHook } from './hooks';
import React, { ComponentType } from 'react';
const FieldComponent: ComponentType<{
  label: string | { [key: string]: string };
  path: string;
}> = ({ label, path }) => (
  <TimeRangePickerField
    label={label}
    path={path}
    rangePickerProps={{
      allowClear: true,
    }}
  />
);

const configObject: JSONField = {
  name: 'TimeRangePickerField',
  defaultValue: [null, null],
  type: 'json',
  hooks: {
    beforeValidate: [fillWithNullIfEmptyHook],
    afterRead: [fillWithNullIfEmptyHook],
  },

  admin: {
    components: {
      Field: FieldComponent,
    },
  },
};
export default configObject;
