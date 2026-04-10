// Shim to help TS/IDE find `vue` module types when the language plugin
// cannot resolve package exports correctly.
// This re-exports runtime-core types and provides a default export.
import type * as RuntimeCore from '@vue/runtime-core';

declare module 'vue' {
  export * from '@vue/runtime-core';
  const Vue: typeof RuntimeCore & { __shim?: true };
  export default Vue;
}
