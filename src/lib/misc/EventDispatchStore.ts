import { writable, type Writable } from "svelte/store";

export interface EventDispatchStore extends Writable<boolean> {
    /**
     * Inform subscribers the event has triggered.
     */
    trigger(this: EventDispatchStore): void;
}

export function eventDispatchStore(): EventDispatchStore {
    let store: Writable<boolean> = writable(false);
    return {
        ...store,
        trigger: function (this: EventDispatchStore) {
            // Have to set a different value so
            // that the `set` function registers it as a new
            // value and informs the subscribers.
            this.update(x => !x);
        }
    }
}