export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        INPUT: string;

        JELLYFIN_HOST: string
        JELLYFIN_PORT: string
        JELLYFIN_API_KEY: string
    }
  }
}
