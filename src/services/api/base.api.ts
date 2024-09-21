import axios, {
  Axios,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

export interface IApiHeaders {
  [s: string]: string;
}

export interface IBaseApiProvider {
  patch<P extends string, R, T>(
    url: P,
    body: R,
    headers?: AxiosRequestConfig,
  ): Promise<T>;
  post<P extends string, R, T>(
    url: P,
    body: R,
    headers?: AxiosRequestConfig,
  ): Promise<T>;
  delete<P extends string, T>(url: P, headers?: AxiosRequestConfig): Promise<T>;
  get<P extends string, T>(url: P, headers?: AxiosRequestConfig): Promise<T>;
}

export abstract class BaseApiProvider implements IBaseApiProvider {
  fetcher: Axios;

  constructor(protected readonly options?: AxiosRequestConfig) {
    this.fetcher = axios.create(options);
  }

  static hasAxiosError(response: AxiosError | unknown): response is AxiosError {
    return (response as AxiosError).isAxiosError !== undefined;
  }

  private handleResponse(response: AxiosResponse | AxiosError) {
    if ('isAxiosError' in response) {
      return response;
    }

    return response.data;
  }

  async patch<P extends string, R, T>(
    url: P,
    body: R,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.fetcher.patch(url, body, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async post<P extends string, R, T>(
    url: P,
    body: R,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.fetcher.post(url, body, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async get<P extends string, T>(
    url: P,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.fetcher.get(url, config);
    return this.handleResponse(response);
  }

  async delete<P extends string, T>(
    url: P,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.fetcher.delete(url, config);
    return this.handleResponse(response);
  }
}
