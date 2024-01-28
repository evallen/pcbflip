<script lang="ts">
    import { convertFileSrc } from "@tauri-apps/api/tauri";

    export let selected: string | null;
    let image: HTMLImageElement | undefined;

    let imageX = 0;
    let imageY = 0;
    let imageScale = 1;
    $: transform = `translate(${imageX}px, ${imageY}px) scale(${imageScale})`;

    function getImageCoordinates(e: WheelEvent) {
        let container = e.currentTarget as HTMLElement;
        let bounds = container.getBoundingClientRect();

        let x = e.clientX - bounds.x - imageX;
        let y = e.clientY - bounds.y - imageY;
        return {x, y};
    }

    const scaleBy = 1.20;
    function canvasZoom(e: WheelEvent) {
        let actualScaleBy = scaleBy ** (-e.deltaY / 78);
        imageScale *= actualScaleBy;

        let imageCoords = getImageCoordinates(e);
        imageX -= imageCoords.x * (actualScaleBy - 1);
        imageY -= imageCoords.y * (actualScaleBy - 1);
    }

    let scrollRate = 0.7;
    function wheelHandler(e: WheelEvent) {
        if (e.ctrlKey) {
            canvasZoom(e);
            return;
        }

        imageY += -e.deltaY * scrollRate;
        imageX += -e.deltaX * scrollRate;
    }
    let canvasContainerWidth = 0, canvasContainerHeight = 0;
</script>

<div 
    id="canvasContainer" 
    class="overflow-hidden min-h-0 h-full" 
    bind:clientWidth={canvasContainerWidth}
    bind:clientHeight={canvasContainerHeight}
    on:wheel={wheelHandler}>

    {#if selected}
        <img src={convertFileSrc(selected)} alt="pic" style:transform={transform}/>
    {/if}

</div>

<style>
    img {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        image-rendering: pixelated;
        border: 1px solid transparent;
        transform-origin: 1px 1px;
    }

    #canvasContainer {
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
</style>