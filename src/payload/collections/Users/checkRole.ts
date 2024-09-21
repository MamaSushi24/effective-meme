import type { User } from '../../../types/payload-types';

export const checkRole = (
  allRoles: User['roles'] = [],
  user?: User
): boolean => {
  
  if (user) {
    if (
      allRoles?.some(role => {
        return user?.roles?.some(individualRole => {
          return individualRole === role;
        });
      })
    )
      return true;
  }

  return false;
};
