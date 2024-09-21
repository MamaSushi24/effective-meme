import { GlobalSetting } from '@/types/payload-types';
import { createContext, useContext } from 'react';

const GlobalSettingsContext = createContext<GlobalSetting>({} as GlobalSetting);
export default GlobalSettingsContext;
export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalSettings must be used within a GlobalSettingsProvider',
    );
  }
  return context;
};
