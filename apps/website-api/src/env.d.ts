declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SESSION_SECRET: string;
    COOKIE_DOMAIN: string;
    NODE_ENV: "development" | "production";
    PLAUSIBLE_API_KEY: string;
    ANALYTICS_API: string;
  }
}