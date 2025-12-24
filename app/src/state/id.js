export function nanoid() {
    // wystarczy do lokalnego UI; jak chcesz “ładniej”, weź nanoid z npm
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
