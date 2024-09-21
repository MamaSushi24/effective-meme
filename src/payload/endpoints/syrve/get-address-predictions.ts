import { SyrveAPIProvider } from '../../../services/api/syrve.api';
import { Endpoint, PayloadHandler } from 'payload/dist/config/types';
import * as yup from 'yup';
import levenshtein from 'fast-levenshtein';
import RESPONSE from './response.json';
const validationSchema = yup.object().shape({
  limit: yup.number().min(1).max(15),
  input: yup.string().min(3).required(),
});
type TQuery = yup.InferType<typeof validationSchema>;

const validate: PayloadHandler = async (req, res, next) => {
  try {
    await validationSchema.validate(req.query, { abortEarly: false });
    next();
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      code: 'invalid_params',
      msg: err.message,
    });
    return;
  }
};

const handler: PayloadHandler = async (req, res, next) => {
  const qs = req.query as unknown as TQuery;
  const limit = qs.limit ? qs.limit : 5;
  const input = qs.input;
  let matchList: Awaited<
    ReturnType<SyrveAPIProvider['getStreets']>
  >['streets'] = [];
  try {
    // const syrveAPI = new SyrveAPIProvider();
    // const { streets } = await syrveAPI.getStreets();
    const streets = RESPONSE.streets;
    matchList = streets;
  } catch (err) {
    req.payload.logger.error(err, 'Could not get streets from Syrve API');
    return res.status(500).json({
      status: 'fail',
      code: 'fail_get_streets',
      msg: 'internal server error',
    });
  }
  const matches = matchList.filter(street => {
    const streetName = street.name.toLowerCase();
    const inputName = input.toLowerCase();
    // Split street name by spaces and check if any of the words match input also split input by spaces and check if any of the words match street name
    const streetNameWords = streetName.split(' ');
    const inputNameWords = inputName.split(' ');
    const inputNameWordsMatch = inputNameWords.some(wordInput => {
      return streetNameWords.some(
        wordStreetName =>
          wordStreetName.includes(wordInput) ||
          levenshtein.get(wordInput, wordStreetName, { useCollator: true }) <= 1
      );
    });
    if (inputNameWordsMatch) return true;
    else return false;
  });
  // Sort by levenshtein distance
  matches.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aLev = levenshtein.get(input, aName, { useCollator: true });
    const bLev = levenshtein.get(input, bName, { useCollator: true });
    return aLev - bLev;
  });
  return res.status(200).json({
    status: 'ok',
    result: matches.slice(0, limit),
  });
};

const endpointGetAddressPredictions: Endpoint = {
  path: '/syrve/get-address-predictions',
  method: 'get',
  handler: [validate, handler],
};
export interface IGetAddressPredictionsResponse {
  status: 'ok' | 'fail';
  result?: {
    id: string;
    name: string;
    externalRevision: number;
    classifierId: string | null;
    isDeleted: boolean;
  }[];
  code?: string;
  msg?: string;
}
export default endpointGetAddressPredictions;
