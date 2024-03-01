<script context="module" lang="ts">
    export const SCALE_MAX = 10;
    export const SCALE_MIN = 1/10;

    export const SCROLL_RATE = 0.7;
    export const SCALE_BY = 1.20;

    export type Area = {
        x: number,
        y: number,
        width: number,
        height: number
    };

    export let canvas: Canvas;

    export interface Mode {
        context?: any;
        begin: (this: Mode) => void;
        undo: (this: Mode) => void;
    }

    let currentMode: Mode | null = null;
    export let currentModeChanged: EventDispatchStore = eventDispatchStore();

    export function switchToMode(mode: Mode) {
        if (mode === currentMode) {
            return;
        }

        cancelMode();
        mode.begin();
        currentMode = mode;
        currentModeChanged.trigger();
    }

    export function cancelMode() {
        currentMode?.undo()
        currentMode = null;
        currentModeChanged.trigger();
    }

    export function getCurrentMode() {
        return currentMode;
    }

    export type ViewerContext = {
        frontImageOpacity: number;
        backImageOpacity: number;
        frontImageMatrix: string;
        backImageMatrix: string;
    };

    export let viewerContext: Writable<ViewerContext> = 
        writable({
            frontImageOpacity: 1,
            backImageOpacity: 0,
            frontImageMatrix: "",
            backImageMatrix: ""
        });
</script>

<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/tauri";
    import Image, { type Transform } from "./Image.svelte";
    import { wasKeyInForm, setImageArea, viewerPan, viewerZoomTo, viewerZoom, imageArea, canvasTransform } from "./Viewer";
	import Canvas from "./Canvas.svelte";
	import { eventDispatchStore, type EventDispatchStore } from "$lib/misc/EventDispatchStore";
	import { writable, type Writable } from "svelte/store";

    export let frontSelected: string | null;
    export let backSelected: string | null;
    export let scale: number;

    let frontImage: Image | undefined;
    let frontTransform: Transform | undefined;

    let backImage: Image | undefined;
    let backTransform: Transform | undefined;

    $: $canvasTransform, frontImage, 
        backImage, applyTransform();

    let updateSliderScale = (x: Transform) => scale = x.scale;
    let centerZoomToScale = (x: number) => {
        viewerZoomTo(canvasContainerWidth / 2 - $canvasTransform.x, canvasContainerHeight / 2 - $canvasTransform.y, x);
        applyTransform();
    };
    $: updateSliderScale($canvasTransform);
    $: centerZoomToScale(scale);

    let canvasContainerWidth = 0, canvasContainerHeight = 0;

    $: canvasContainerWidth, canvasContainerHeight, 
        frontTransform, 
        backTransform, 
        setImageArea([frontImage, backImage]);

    function applyTransform() {
        frontImage?.setTransform($canvasTransform);
        backImage?.setTransform($canvasTransform);
    }

    function wheelHandler(e: WheelEvent) {
        if (!$imageArea) return;
        if (e.ctrlKey) {
            viewerZoom(e);
        } else {
            viewerPan(e, canvasContainerWidth, canvasContainerHeight);
        }
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.repeat || wasKeyInForm(e)) return;
        switch (e.key) {
            case "f":
                $viewerContext.frontImageOpacity = 1;
                $viewerContext.backImageOpacity = 0;
                break;
            case "b":
                $viewerContext.frontImageOpacity = 0;
                $viewerContext.backImageOpacity = 1;
                break;
            case "d":
                $viewerContext.frontImageOpacity = 0.5;
                $viewerContext.backImageOpacity = 1;
                break;
        }
    }

</script>

<svelte:window on:keydown={keyDownHandler} />
<div 
    id="canvasContainer" 
    class="overflow-hidden overflow-x-hidden min-h-0 h-full" 
    bind:clientWidth={canvasContainerWidth}
    bind:clientHeight={canvasContainerHeight}
    on:wheel={wheelHandler}
    role="none">

    {#if backSelected}
        <Image path={convertFileSrc(backSelected)} 
                opacity={$viewerContext.backImageOpacity}
                matrix={$viewerContext.backImageMatrix}
                bind:this={backImage} 
                bind:transform={backTransform}
                />
    {/if}
    {#if frontSelected}
        <Image path={convertFileSrc(frontSelected)} 
                opacity={$viewerContext.frontImageOpacity}
                matrix={$viewerContext.frontImageMatrix}
                bind:this={frontImage} 
                bind:transform={frontTransform}
                />
    {/if}
    {#if $imageArea}
        <div id="wrapperBox"
            style:left={$imageArea.x}px
            style:top={$imageArea.y}px
            style:width={$imageArea.width}px
            style:height={$imageArea.height}px>
        </div>
    {/if}
    <Canvas bind:this={canvas} width={canvasContainerWidth} height={canvasContainerHeight} transform={$canvasTransform} />
</div>

<style>
    #canvasContainer {
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        cursor: crosshair;
    }

    #wrapperBox {
        position: absolute;
        border: 1px dashed yellow;
        width: 100px;
        height: 100px;
    }
</style>