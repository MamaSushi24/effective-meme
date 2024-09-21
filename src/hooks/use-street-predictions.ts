import { IGetAddressPredictionsResponse } from '@/payload/endpoints/syrve/get-address-predictions';
import axios from 'axios';
import useSWR from 'swr';
import { useDebounce } from 'usehooks-ts';

const useStreetPredictions = (input: string, limit: number = 5) => {
  const debouncedInput = useDebounce(input, 300);
  const { data, error, isLoading } = useSWR(
    {
      input: debouncedInput,
      limit,
    },
    async ({ input, limit }) => {
      if (typeof input !== 'string' || input.length < 3) return [];
      try {
        const res = await axios.get<IGetAddressPredictionsResponse>(
          `/api/syrve/get-address-predictions`,
          { params: { input, limit } }
        );
        return res.data.result;
      } catch (err) {
        console.warn(err);
      }
    }
  );
  return {
    predictions: data || [],
    isLoading,
    error,
  };
};
export default useStreetPredictions;
