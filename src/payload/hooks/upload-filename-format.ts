import { CollectionBeforeOperationHook } from 'payload/types';
import slugify from 'slugify';

const uploadFilenameFormat: CollectionBeforeOperationHook = ({
  operation,
  args,
}) => {
  if (operation === 'create') {
    args.req.files.file.name = slugify(args.req.files.file.name, {
      lower: true,
    });
  }
};
export default uploadFilenameFormat;
