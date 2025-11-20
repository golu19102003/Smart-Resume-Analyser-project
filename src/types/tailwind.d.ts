// Minimal module declarations to avoid TypeScript errors in tailwind config
// These keep the config file lightweight without requiring extra npm installs
declare module "tailwindcss" {
  export type Config = any;
  const _default: any;
  export default _default;
}

declare module "tailwindcss-animate";

// Allow use of `require()` in this config file without @types/node
declare const require: any;
