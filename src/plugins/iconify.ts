import { addAPIProvider } from '@iconify/vue';

/** Setup the iconify offline */
export function setupIconifyOffline() {
  const { VITE_ICONIFY_URL } = import.meta.env;

  if (VITE_ICONIFY_URL) {
    addAPIProvider('', { resources: [VITE_ICONIFY_URL] });

    // disableCache was removed in newer @iconify/vue versions; skip disabling cache
  }
}
