/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dirección base del backend. Si no se define, se usa http://localhost:8080 */
  readonly VITE_API_URL?: string;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
