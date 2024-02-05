import { type Vector2d } from "$lib/misc/types";
import { get, writable } from "svelte/store";
import { type Writable } from "svelte/store";


export enum KeyPointStatus {
    Unset = "Unset",
    Set = "Set"
}

export type KeyPoint = {
    status: KeyPointStatus;
    pos: Vector2d;
};

export let keyPoints: Writable<KeyPoint[]> = writable([]);

export let nextKeyPointIdx: Writable<number | null> = writable(null);

const NUM_KEY_POINTS = 4;

for (let i = 0; i < NUM_KEY_POINTS; i++) {
    get(keyPoints).push({
        status: KeyPointStatus.Unset,
        pos: { x: 0, y: 0 }
    });
}

export function setKeyPoint(index: number, pos: Vector2d) {
    keyPoints.update(points => {
        points[index] = {
            status: KeyPointStatus.Set,
            pos
        };
        return points;
    });
}

/**
 * 
 * @param pos Position of the key point.
 * @returns The index of the key point that was set.
 */
export function setNextKeyPoint(pos: Vector2d) {
    let oldIndex = get(nextKeyPointIdx);
    if (oldIndex === null) return oldIndex;
    
    setKeyPoint(oldIndex, pos);

    let nextIdx: number | null = oldIndex + 1;
    if (nextIdx >= NUM_KEY_POINTS) {
        nextIdx = null;
    }

    nextKeyPointIdx.set(nextIdx);
    return oldIndex;
}