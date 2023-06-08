import { IHttpDelete, IHttpGet, IHttpInterceptor, IHttpPost, IHttpPut } from './index';
export interface IHttpClient extends IHttpGet, IHttpPost, IHttpPut, IHttpDelete, IHttpInterceptor {
}
