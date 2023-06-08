import { HttpRequestHeaders } from './index';
export interface IHttpGet {
    get<R>(path: string, headers?: HttpRequestHeaders): Promise<R>;
}
