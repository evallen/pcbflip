import { type Vector2d } from "$lib/misc/types";
import { writable } from "svelte/store";
import { type Writable } from "svelte/store";

const NUM_KEY_POINTS = 4;

export enum KeyPointStatus {
    Unset = "Unset",
    Set = "Set"
}

export type KeyPoint = {
    status: KeyPointStatus;
    pos: Vector2d;
};

export class KeyPointCollection {
    points: KeyPoint[];
    nextPointIndex: number | null = null;
    show: boolean = false;

    constructor() {
        this.points = [];
        for (let i = 0; i < NUM_KEY_POINTS; i++) {
            this.points.push({
                status: KeyPointStatus.Unset,
                pos: { x: 0, y: 0 }
            });
        }
    }

    setKeyPoint(index: number, pos: Vector2d) {
        this.points[index] = {
            status: KeyPointStatus.Set,
            pos
        };
    }

    setNextKeyPoint(pos: Vector2d) {
        if (this.nextPointIndex === null) return;

        this.setKeyPoint(this.nextPointIndex, pos);

        if (this.nextPointIndex + 1 >= NUM_KEY_POINTS) {
            this.nextPointIndex = null;
            return;
        }

        this.nextPointIndex++;
    }
}

export let frontKeyPoints: Writable<KeyPointCollection> =
    writable(new KeyPointCollection());
export let backKeyPoints: Writable<KeyPointCollection> =
    writable(new KeyPointCollection());

