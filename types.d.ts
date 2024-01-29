export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        INPUT: string;
    }
  }
}
