declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HOST: string;
            PORT: number;
            APIBASEURL: string;
        }
    }
}

export {};
