import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const http = {
  /** GET */

  async get(url: string, config?: AxiosRequestConfig<any>) {
    try {
      const res = await axios.get(url, config);
      return res;
    } catch (e) {
      return handleCommonError(e as Error);
    }
  },
  /** POST */
  async post(url: string, data: any) {
    try {
      const res = await axios.post(url, data);
      return res;
    } catch (e) {
      return handleCommonError(e as Error);
    }
  },
};

/** Axios 에러 핸들링 함수 */
function handleAxiosError(e: AxiosError): AxiosResponse | undefined {
  return e.response;
}

/** 에러 핸들링 함수 */
function handleCommonError(e: Error) {
  if (e instanceof AxiosError) {
    return handleAxiosError(e);
  } else {
    console.error(e);
  }
}
