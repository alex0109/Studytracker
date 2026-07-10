// client/steiger.config.ts
import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./app/**"],
    rules: {
      "fsd/public-api": "off",
      "fsd/no-public-api-sidestep": "off",
      "fsd/forbidden-imports": "off",
    },
  },
  {
    files: ["./shared/**"],
    rules: {
      "fsd/forbidden-imports": "warn",
    },
  },
]);
