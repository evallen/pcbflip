<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/tauri";
    import Image, { type Transform } from "./Image.svelte";

    export let selected: string | null;

    const SCALE_MAX = 10;
    const SCALE_MIN = 1/10;

    const SCROLL_RATE = 0.7;
    const SCALE_BY = 1.20;

    let scale = 1;
    let imageArea = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    let canvasContainerWidth = 0, canvasContainerHeight = 0;

    let frontImage: Image | undefined;
    let frontTransform: Transform | undefined;
    let showFrontImage = true;

    $: frontTransform, setImageArea();

    function getViewerCoordinates(e: WheelEvent) {
        let container = e.currentTarget as HTMLElement;
        let bounds = container.getBoundingClientRect();

        let x = e.clientX - bounds.x;
        let y = e.clientY - bounds.y;
        return {x, y};
    }

    function viewerZoom(e: WheelEvent) {
        let actualScaleBy = SCALE_BY ** (-e.deltaY / 78);
        let newScale = Math.min(SCALE_MAX, actualScaleBy * scale)
        scale = Math.max(SCALE_MIN, newScale);

        let viewerCoordinates = getViewerCoordinates(e);
        frontImage?.zoomTo(viewerCoordinates.x, viewerCoordinates.y, scale);
    }

    function wheelHandler(e: WheelEvent) {
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

        frontImage?.translateTo(newX, newY);
    }

    function keyUpHandler(e: KeyboardEvent) {
        console.log(e.key);
        if (e.key === "f") {
            showFrontImage = !showFrontImage;
        }
    }

    function setImageArea() {
        let apparentDimensions = frontImage?.apparentDims();
        imageArea.x = frontTransform?.x ?? 0;
        imageArea.y = frontTransform?.y ?? 0;
        imageArea.width = (apparentDimensions?.width ?? 0);
        imageArea.height = (apparentDimensions?.height ?? 0);
    }
</script>

<svelte:window on:keyup={keyUpHandler} />
<div 
    id="canvasContainer" 
    class="overflow-hidden min-h-0 h-full" 
    bind:clientWidth={canvasContainerWidth}
    bind:clientHeight={canvasContainerHeight}
    on:wheel={wheelHandler}
    role="none">

    {#if selected}
        <Image path={convertFileSrc(selected)} 
                visible={showFrontImage}
                bind:this={frontImage} 
                bind:transform={frontTransform}
                />
        <div id="wrapperBox"
            style:left={imageArea.x}px
            style:top={imageArea.y}px
            style:width={imageArea.width}px
            style:height={imageArea.height}px>
        </div>
    {/if}

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