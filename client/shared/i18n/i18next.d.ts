import "i18next";
import type { TranslationResource } from "./resources";

// Keys are checked by TypeScript: a missing key is a build error, not a blank on the page
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: TranslationResource };
  }
}
