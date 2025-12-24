const DEFAULT_KEY = 'aibot_app_state_v1';

export function createLocalStorageAdapter(storageKey = DEFAULT_KEY) {
    return {
        /** @returns {any|null} */
        load() {
            try {
                const raw = localStorage.getItem(storageKey);
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        },

        /** @param {any} state */
        save(state) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(state));
            } catch {
                // brak miejsca / privacy mode / quota
            }
        },

        clear() {
            try {
                localStorage.removeItem(storageKey);
            } catch {
                // ignoruj
            }
        },
    };
}
