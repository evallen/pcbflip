/**
 * Utilities for Viewer.svelte.
 */

import Image from "./Image.svelte";
import { SCALE_MAX, SCALE_MIN, SCROLL_RATE, SCALE_BY, type Area } from "./Viewer.svelte";
import { writable, type Writable, get } from "svelte/store";
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

export function viewerZoom(e: WheelEvent) {
    let transform = get(canvasTransform);
    let actualScaleBy = SCALE_BY ** (-e.deltaY / 78);
    let newScale = Math.min(SCALE_MAX, actualScaleBy * transform.scale);
    newScale = Math.max(SCALE_MIN, newScale);

    let viewerCoordinates = getViewerCoordinates(e);
    let canvasCoordinates = {
        x: viewerCoordinates.x - transform.x,
        y: viewerCoordinates.y - transform.y
    }

    viewerZoomTo(canvasCoordinates.x, canvasCoordinates.y, newScale);
}

export function viewerZoomTo(viewerX: number, viewerY: number, scale: number) {
    let transform = get(canvasTransform);
    let factor = scale / transform.scale;
    let newX = transform.x - (viewerX * (factor - 1));
    let newY = transform.y - (viewerY * (factor - 1));
    canvasTransform.set({
        x: newX,
        y: newY,
        scale
    });
}

export function viewerPan(e: WheelEvent, viewerWidth: number, viewerHeight: number) {
    let area = get(imageArea);
    if (!area) return;

    let maxX = viewerWidth / 2;
    let maxY = viewerHeight / 2;

    let minX = viewerWidth / 2 - area.width;
    let minY = viewerHeight / 2 - area.height;

    let newX = area.x + (-e.deltaX * SCROLL_RATE);
    let newY = area.y + (-e.deltaY * SCROLL_RATE);

    newX = Math.max(Math.min(maxX, newX), minX);
    newY = Math.max(Math.min(maxY, newY), minY);

    canvasTransform.update((t: Transform) => { return {
        ...t,
        x: newX,
        y: newY
    }});
}