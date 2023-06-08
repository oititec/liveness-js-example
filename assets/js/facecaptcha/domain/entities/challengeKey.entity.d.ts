export type ChallengeFaceType = {
    codigo: string;
    imagem: string;
};
export type ChallengeKeyItem = {
    mensagem: string;
    tempoEmSegundos: number;
    tipoFace: ChallengeFaceType;
};
export type ChallengeKey = {
    index: string;
    challenges: ChallengeKeyItem[];
    chkey: string;
    numberOfChallenges: number;
    snapFrequenceInMillis: number;
    snapNumber: number;
    totalTime: number;
};
