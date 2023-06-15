import { HttpRequestHeaders } from './index';
export interface IHttpDelete {
    delete<R>(path: string, headers?: HttpRequestHeaders): Promise<R>;
}
