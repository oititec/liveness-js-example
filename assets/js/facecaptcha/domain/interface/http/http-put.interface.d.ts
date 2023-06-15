import { HttpRequestHeaders } from './index';
export interface IHttpPut {
    put<R>(path: string, param: any, headers?: HttpRequestHeaders): Promise<R>;
}
