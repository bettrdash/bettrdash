declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SESSION_SECRET: string;
    COOKIE_DOMAIN: string;
    NODE_ENV: "development" | "production";
  }
}