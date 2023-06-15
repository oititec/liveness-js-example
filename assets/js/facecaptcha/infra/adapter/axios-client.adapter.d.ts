import { AxiosInstance } from 'axios';
import { HttpRequestHeaders, IHttpClient } from '../../domain/interface';
export declare class AxiosClientAdapter implements IHttpClient {
    private readonly baseUrl;
    private readonly headers?;
    private readonly timeout?;
    private client;
    constructor(client: any, baseUrl: string, headers?: HttpRequestHeaders, timeout?: number);
    get<R>(path: string, headers?: HttpRequestHeaders): Promise<R>;
    post<R>(path: string, params: any, headers?: HttpRequestHeaders): Promise<R>;
    put<R>(path: string, param: any, headers?: HttpRequestHeaders): Promise<R>;
    delete<R>(path: string, headers?: HttpRequestHeaders): Promise<R>;
    interceptor(callback: (axiosInstance: AxiosInstance) => AxiosInstance): void;
}
