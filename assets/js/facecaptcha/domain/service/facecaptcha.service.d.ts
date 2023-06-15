import { AppKey, ChallengeKey, documentCheckRequest, ProductionKey, SessionRequest, SessionToken } from '../entities';
import { FaceCaptchaOptions } from '../types';
import { Liveness3DCheckRequest, Liveness2DCheckRequest } from '../entities/livenessCheck.entity';
export declare class FaceCaptcha {
    private readonly options;
    private httpClient;
    constructor(client: any, options: FaceCaptchaOptions);
    getProductionKey(appKey: AppKey): Promise<ProductionKey>;
    private decryptProductionKey;
    startChallenge(appKey: AppKey): Promise<ChallengeKey>;
    private decryptChallengeKey;
    getSessionToken(session: SessionRequest): Promise<SessionToken>;
    private decryptSessionToken;
    liveness3DCheck(parameters: Liveness3DCheckRequest): Promise<any>;
    liveness2DCheck(parameters: Liveness2DCheckRequest): Promise<any>;
    sendDocument(parameters: documentCheckRequest): Promise<any>;
}
