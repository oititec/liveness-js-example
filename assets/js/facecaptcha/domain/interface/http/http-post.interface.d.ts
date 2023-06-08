import { HttpRequestHeaders } from './index';
export interface IHttpPost {
    post<R>(path: string, param: any, headers?: HttpRequestHeaders): Promise<R>;
}
