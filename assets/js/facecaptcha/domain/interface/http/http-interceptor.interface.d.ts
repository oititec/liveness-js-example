import { AxiosInstance } from 'axios';
export interface IHttpInterceptor {
    interceptor(callback: (axiosInstance: AxiosInstance) => AxiosInstance): any;
}
