import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored design handoff (reference prototypes, not app source):
    "docs/**",
    // CommonJS production entrypoint (not part of the Next/TS app surface):
    "server.js",
    // Output build adapter Cloudflare — kode hasil generate, bukan sumber kita.
    ".open-next/**",
    ".wrangler/**",
  ]),
]);

export default eslintConfig;
