declare module '*.css';

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  // puedes añadir más si lo deseas
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
