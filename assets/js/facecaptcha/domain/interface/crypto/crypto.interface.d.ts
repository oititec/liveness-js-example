import { ICryptoDecrypt } from './crypto-decrypt.interface';
import { ICryptoEncrypt } from './crypto-encrypt.interface';
export interface ICrypto extends ICryptoEncrypt, ICryptoDecrypt {
}
