import { useField } from 'payload/components/forms';
import React, { ComponentType } from 'react';
import { ChromePicker } from 'react-color';
const ColorPickerField: ComponentType<{ path: string }> = ({ path }) => {
  const { value, setValue } = useField<string>({
    path,
  });
  return (
    <div>
      <p>Color</p>
      <ChromePicker
        color={value ?? '#fff'}
        disableAlpha
        onChange={color => {
          setValue(color.hex);
        }}
      />
    </div>
  );
};
export default ColorPickerField;
