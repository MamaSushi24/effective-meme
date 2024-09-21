import { GlobalSetting, MetaData } from '@/types/payload-types';

export default function mergeJsonLD(
  globalSettings: GlobalSetting,
  data: Object & {
    meta?: MetaData;
  }
) {
  const JsonLD = [globalSettings.seo?.jsonld, data.meta?.jsonld]
    .filter(Boolean)
    .flat();
  data.meta = {
    ...data.meta,
    jsonld: JsonLD,
  };
}
