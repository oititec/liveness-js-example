export type Liveness3DCheckRequest = {
    appkey: string;
    userAgent: string;
    faceScan: string;
    auditTrailImage: string;
    lowQualityAuditTrailImage: string;
    sessionId: string;
};
export type Liveness2DCheckRequest = {
    appkey: string;
    chkey: string;
    images: string;
};
