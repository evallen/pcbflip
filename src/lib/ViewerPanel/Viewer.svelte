<script context="module" lang="ts">
    export const SCALE_MAX = 10;
    export const SCALE_MIN = 1/10;

    export const SCROLL_RATE = 0.7;
    export const SCALE_BY = 1.20;
</script>

<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/tauri";
    import Image, { type Transform } from "./Image.svelte";
    import { Stage, Layer, Rect } from "svelte-konva";
    import { type Vector2d } from "konva/lib/types";

    export let frontSelected: string | null;
    export let backSelected: string | null;
    export let scale: number;

    type Area = {
        x: number,
        y: number,
        width: number,
        height: number
    };
    let imageArea: null | Area = null;

    let canvasTransform: Transform = {
        x: 0,
        y: 0,
        scale: 1
    };
    $: canvasTransform, frontImage, backImage, applyTransform();

    let f = (x: Transform) => scale = x.scale;
    let fInv = (x: number) => {
        // canvasTransform.scale = x;
        viewerZoomTo(canvasContainerWidth / 2 - canvasTransform.x, canvasContainerHeight / 2 - canvasTransform.y, x);
        applyTransform();
    };
    $: f(canvasTransform);
    $: fInv(scale);

    let canvasContainerWidth = 0, canvasContainerHeight = 0;

    let frontImage: Image | undefined;
    let frontTransform: Transform | undefined;
    let frontImageOpacity = 1;

    let backImage: Image | undefined;
    let backTransform: Transform | undefined;
    let backImageOpacity = 0;

    $: frontTransform, backTransform, setImageArea();

    function getViewerCoordinates(e: WheelEvent) {
        let container = e.currentTarget as HTMLElement;
        let bounds = container.getBoundingClientRect();

        let x = e.clientX - bounds.x;
        let y = e.clientY - bounds.y;
        return {x, y};
    }

    function applyTransform() {
        if (frontImage) {
            frontImage.setTransform(canvasTransform);
        }
        if (backImage) {
            backImage.setTransform(canvasTransform);
        }
    }

    function viewerZoomTo(viewerX: number, viewerY: number, scale: number) {
        let factor = scale / canvasTransform.scale;
        let newX = canvasTransform.x - (viewerX * (factor - 1));
        let newY = canvasTransform.y - (viewerY * (factor - 1));
        canvasTransform = {
            x: newX,
            y: newY,
            scale
        }
    }

    function viewerZoom(e: WheelEvent) {
        let actualScaleBy = SCALE_BY ** (-e.deltaY / 78);
        let newScale = Math.min(SCALE_MAX, actualScaleBy * canvasTransform.scale);
        newScale = Math.max(SCALE_MIN, newScale);

        let viewerCoordinates = getViewerCoordinates(e);
        let canvasCoordinates = {
            x: viewerCoordinates.x - canvasTransform.x,
            y: viewerCoordinates.y - canvasTransform.y
        }

        viewerZoomTo(canvasCoordinates.x, canvasCoordinates.y, newScale);
    }

    function wheelHandler(e: WheelEvent) {
        if (!imageArea) return;
        if (e.ctrlKey) {
            viewerZoom(e);
            return;
        }

        let maxX = canvasContainerWidth / 2;
        let maxY = canvasContainerHeight / 2;

        let minX = canvasContainerWidth / 2 - imageArea.width;
        let minY = canvasContainerHeight / 2 - imageArea.height;

        let newX = imageArea.x + (-e.deltaX * SCROLL_RATE);
        let newY = imageArea.y + (-e.deltaY * SCROLL_RATE);

        newX = Math.max(Math.min(maxX, newX), minX);
        newY = Math.max(Math.min(maxY, newY), minY);

        canvasTransform = {
            ...canvasTransform,
            x: newX,
            y: newY
        }
    }

    /**
     * Check if the key press was done in a form field (typing).
     * @param e The keyboard event.
     */
    function wasKeyInForm(e: KeyboardEvent) { 
        const formElements = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
        if (!e.target) return false;
        let tagName = (e.target as HTMLElement).tagName;
        return formElements.includes(tagName);
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.repeat || wasKeyInForm(e)) return;
        console.log(e.key);
        switch (e.key) {
            case "f":
                frontImageOpacity = 1;
                backImageOpacity = 0;
                break;
            case "b":
                frontImageOpacity = 0;
                backImageOpacity = 1;
                break;
            case "d":
                frontImageOpacity = 0.5;
                backImageOpacity = 1;
                break;
        }
    }

    function setImageArea() {
        let images: Array<Image | undefined> = [frontImage, backImage];

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

        imageArea = newImageArea;
    }
</script>

<svelte:window on:keydown={keyDownHandler} />
<div 
    id="canvasContainer" 
    class="overflow-hidden min-h-0 h-full" 
    bind:clientWidth={canvasContainerWidth}
    bind:clientHeight={canvasContainerHeight}
    on:wheel={wheelHandler}
    role="none">

    {#if backSelected}
        <Image path={convertFileSrc(backSelected)} 
                opacity={backImageOpacity}
                bind:this={backImage} 
                bind:transform={backTransform}
                />
    {/if}
    {#if frontSelected}
        <Image path={convertFileSrc(frontSelected)} 
                opacity={frontImageOpacity}
                bind:this={frontImage} 
                bind:transform={frontTransform}
                />
    {/if}
    {#if imageArea}
        <div id="wrapperBox"
            style:left={imageArea.x}px
            style:top={imageArea.y}px
            style:width={imageArea.width}px
            style:height={imageArea.height}px>
        </div>
    {/if}
    <Stage config={{ 
        width: canvasContainerWidth, 
        height: canvasContainerHeight, 
        scale: { x: canvasTransform.scale, y: canvasTransform.scale },
        x: canvasTransform.x, 
        y: canvasTransform.y
        }}>
        <Layer>
            <!-- <Rect config={{ x: 100, y: 100, width: 100, height: 100, fill: 'red' }} /> -->
        </Layer>
    </Stage>
</div>

<style>
    #canvasContainer {
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    #wrapperBox {
        position: absolute;
        border: 5px solid red;
        width: 100px;
        height: 100px;
    }
</style>