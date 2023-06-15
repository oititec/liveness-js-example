export interface ICryptoDecrypt {
    decrypt(cipher: string, key: string): Promise<string>;
}
