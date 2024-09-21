import { useEffect, useState } from 'react';
import { useLocale } from 'payload/components/utilities';
import axios from 'axios';
const SideBarRowLabel = (args: any) => {
  const locale = useLocale();
  const [label, setLabel] = useState<string>(`Item ${args.index}`);
  useEffect(() => {
    if (!args.data.group) return;
    (async () => {
      try {
        const groupData = await axios.get(
          `/api/groups/${args.data.group}?locale=${locale}`
        );
        const groupName = groupData.data.name || groupData.data.syrveName;
        setLabel(groupName);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, [args.data.group, locale]);
  return label;
};
export default SideBarRowLabel;
