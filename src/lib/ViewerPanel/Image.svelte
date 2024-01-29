<script context="module" lang="ts">
    export type Transform = {
        x: number;
        y: number;
        scale: number;
    };
</script>

<script lang="ts">
    export let path: string;
    export let transform: Transform = {
        x: 0,
        y: 0,
        scale: 1
    };
    export let visible: boolean = true;

    let _img: HTMLImageElement;

    $: transformString = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;

    function getImageCoordinates(localX: number, localY: number) {
        let x = localX - transform.x;
        let y = localY - transform.y;
        return {x, y};
    }

    export function zoomBy(localX: number, localY: number, factor: number) {
        transform.scale *= factor;

        let imageCoords = getImageCoordinates(localX, localY);
        transform.x -= imageCoords.x * (factor - 1);
        transform.y -= imageCoords.y * (factor - 1);
    }

    export function zoomTo(localX: number, localY: number, scale: number) {
        zoomBy(localX, localY, scale / transform.scale);
    }

    export function translateBy(x: number, y: number) {
        transform.x += x;
        transform.y += y;
    }

    export function translateTo(x: number, y: number) {
        transform.x = x;
        transform.y = y;
    }

    export function img() {
        return _img;
    }

    export function apparentDims() {
        return {
            width: _img.clientWidth * transform.scale,
            height: _img.clientHeight * transform.scale
        };
    }
</script>

<img src={path} 
     class="{visible ? 'opacity-100' : 'opacity-50'}" 
     alt="pic" 
     bind:this={_img} 
     style:transform={transformString}/>

<style>
    img {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        image-rendering: pixelated;
        border: 1px solid transparent;
        transform-origin: 1px 1px;
        position: absolute;
    }
</style>