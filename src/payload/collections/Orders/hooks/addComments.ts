import { CollectionBeforeValidateHook } from 'payload/types';

const addComments: CollectionBeforeValidateHook = ({ data, req }) => {
  // Delivery section
  const deliverySection: string[] = [];
  if (data?.do_not_call) deliverySection.push('Do not call');
  if (data?.do_not_ring_doorbell) deliverySection.push('Do not ring doorbell');
  if (data?.leave_by_the_door) deliverySection.push('Leave by the door');
  if (data?.change) deliverySection.push(`Change from ${data?.change}`);
  if (deliverySection.length > 0) deliverySection.unshift('\nDelivery:');

  const deliveryComment = deliverySection.join('\n');

  // Number of people
  let numberOfPeople = '';
  if (data?.numberOfPeople)
    numberOfPeople = `\nNumber of people: ${data.numberOfPeople}`;

  // Number of sticks with helper
  let numberOfSticks = '';
  if (data?.numberOfSticksWithHelper > 0)
    numberOfSticks = `\nNumber of sticks with helper: ${data?.numberOfSticksWithHelper}`;
  const modifiedComments =
    data?.comment ?? '' + deliveryComment + numberOfPeople + numberOfSticks;
  return { ...data, comment: modifiedComments };
};
export default addComments;
