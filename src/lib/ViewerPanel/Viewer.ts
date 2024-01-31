/**
 * Utilities for Viewer.svelte.
 */

import Image from "./Image.svelte";
import { type Area } from "./Viewer.svelte";
import { writable, type Writable } from "svelte/store";
import { type Transform } from "./Image.svelte";

export let imageArea: Writable<Area | null> = writable(null);

export let canvasTransform: Writable<Transform> = writable({
    x: 0,
    y: 0,
    scale: 1
})

export function getViewerCoordinates(e: WheelEvent) {
    let container = e.currentTarget as HTMLElement;
    let bounds = container.getBoundingClientRect();

    let x = e.clientX - bounds.x;
    let y = e.clientY - bounds.y;
    return {x, y};
}

/**
 * Check if the key press was done in a form field (typing).
 * @param e The keyboard event.
 */
export function wasKeyInForm(e: KeyboardEvent) { 
    const formElements = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
    if (!e.target) return false;
    let tagName = (e.target as HTMLElement).tagName;
    return formElements.includes(tagName);
}

export function setImageArea(images: Array<Image | undefined>) {
    let newImageArea: null | Area = null;
    for (let image of images) {
        if (!image) continue;

        let apparentDims = image.apparentDims();
        if (!newImageArea) {
            newImageArea = {
                x: image.getTransform().x,
                y: image.getTransform().y,
                width: apparentDims.width,
                height: apparentDims.height
            }
        } else {
            // The x and y coordinates of the bottom right corner of the 
            // pre-existing image area.
            let areaRightX = newImageArea.x + newImageArea.width;
            let areaBottomY = newImageArea.y + newImageArea.height;

            // The x and y coordinates of the top left corner of the new
            // image area.
            let x = Math.min(newImageArea.x, image.getTransform().x);
            let y = Math.min(newImageArea.y, image.getTransform().y);

            // The x and y coordinates of the bottom right corner of the 
            // *new* image we are adding.
            let thisImageRightX = image.getTransform().x + apparentDims.width;
            let thisImageBottomY = image.getTransform().y + apparentDims.height;

            let width = Math.max(areaRightX - x, thisImageRightX - x);
            let height = Math.max(areaBottomY - y, thisImageBottomY - y);

            newImageArea = { x, y, width, height };
        }
    }

    imageArea.set(newImageArea);
}
