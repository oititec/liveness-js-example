export interface ICryptoEncrypt {
    encrypt(text: string, key: string): Promise<string>;
}
