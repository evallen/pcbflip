<script context="module" lang="ts">
    export type Transform = {
        x: number;
        y: number;
        scale: number;
    };
</script>

<script lang="ts">
	import { onMount } from "svelte";
    // @ts-ignore
    import { Homography } from 'homography';

    onMount(() => {
        const srcPoints = [[0, 0], [0, 100], [100, 0], [100, 100]];
        // const dstPoints = [[1/5, 1/5], [0, 1/2], [1, 0], [6/8, 6/8]];
        const dstPoints = [[0, 0], [0, 100], [-100, 0], [-100, 100]];
        // const dstPoints = [[0, 0], [0, 1], [1, 0], [0.6, 0.6]];

        const myHomography = new Homography();
        // matrix = myHomography.getTransformationMatrixAsCSS(srcPoints, dstPoints, _img.clientWidth, _img.clientHeight);
        // myHomography.setRefere
        // myHomography.setImage(_img);
        // matrix = myHomography.getTransformationMatrixAsCSS(srcPoints, dstPoints);
        console.log(matrix);
    });

    export let path: string;
    export let transform: Transform = {
        x: 0,
        y: 0,
        scale: 1
    };
    export let opacity: number = 1;

    let _img: HTMLImageElement;
    export let matrix: string = "";

    $: transformString = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) ${matrix}`;
    // $: transformString = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) matrix3d(3, 0, 0, 0.00066, 0, 3, 0, 0.0005, 0, 0, 1, 0, 0, 0, 0, 1)`;
    // $: transformString = `${matrix} translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;

    export function img() {
        return _img;
    }

    export function apparentDims() {
        return {
            width: _img.clientWidth * transform.scale,
            height: _img.clientHeight * transform.scale
        };
    }
    
    export function getTransform() {
        return transform;
    }

    export function setTransform(newTransform: Transform) {
        // Copy with Object.assign so that any changes we make
        // to this image's transform don't affect the canvas one.
        Object.assign(transform, newTransform);
        transform = transform;
    }
</script>

<img src={path} 
     alt="pic" 
     bind:this={_img} 
     style:opacity={opacity}
     style:transform={transformString}/>

<style>
    img {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        image-rendering: pixelated;
        border: 1px solid transparent;
        transform-origin: 1px 1px;
        position: absolute;
        max-width: none;
    }
</style>