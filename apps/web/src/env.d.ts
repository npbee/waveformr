/// <reference types="astro/client" />
interface ImportMetaEnv {
  ANALYSIS_URL: string;
  API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
