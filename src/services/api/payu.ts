import axios from 'axios';
import { BaseApiProvider } from './base.api';
const apiConfig = {
  baseURL: process.env.PAYU_API_URL,
};
export class PayUAPI extends BaseApiProvider {
  token = '';
  constructor() {
    super(apiConfig);
    this.fetcher.interceptors.request.use(
      async config => {
        if (!this.token) {
          this.token = await this.getToken();
        }
        config.headers['Authorization'] = `Bearer ${this.token}`;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
  async getToken() {
    try {
      const response = await axios.post(
        process.env.PAYU_API_URL + '/pl/standard/user/oauth/authorize',
        {
          grant_type: 'client_credentials',
          client_id: process.env.PAYU_CLIENT_ID,
          client_secret: process.env.PAYU_CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      this.token = response.data.access_token;
      return response.data.access_token;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createOrder(orderData: {
    notifyUrl?: string;
    customerIp: string;
    description: string;
    currencyCode: string;
    totalAmount: number;
    products?: {
      name: string;
      unitPrice: number;
      quantity: number;
    }[];
  }) {
    try {
      const response = await fetch(apiConfig.baseURL + '/api/v2_1/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...orderData,
          merchantPosId: process.env.PAYU_POS_ID,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${await this.getToken()}`,
        },
        redirect: 'manual',
      });

      return response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
