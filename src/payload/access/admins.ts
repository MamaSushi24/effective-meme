import type { AccessArgs } from 'payload/config';

import { checkRole } from '../collections/Users/checkRole';
import type { User } from '../../types/payload-types';

type isAdmin = (args: AccessArgs<unknown, User>) => boolean;

export const admins: isAdmin = ({ req: { user } }) => {
  if (!user) return false;
  return checkRole(['admin'], user);
};
