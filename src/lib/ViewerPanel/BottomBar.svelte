<script lang="ts">
    import { ZoomIn } from "lucide-svelte";
    import Slider from "$lib/components/ui/slider/slider.svelte";
    import { SCALE_MIN, SCALE_MAX } from "./Viewer.svelte";

    export let zoom: number;
    let _zoom: number[] = [0];

    // Need these two functions to keep the slider and the actual
    // external zoom value in sync.
    let setExternalZoom = (x: number[]) => zoom = 10**x[0];
    let setSliderZoom = (x: number) => _zoom[0] = Math.log10(x);

    $: setExternalZoom(_zoom);
    $: setSliderZoom(zoom);
</script>


<div class="flex w-full items-center space-x-5 p-2 border-t-[1px]">
    <ZoomIn />
    <Slider id="zoomSlider" bind:value={_zoom} max={Math.log10(SCALE_MAX)} step={0.02} min={Math.log10(SCALE_MIN)} class="max-w-[70%] cursor-pointer" />
    <label for="zoomSlider">{zoom.toFixed(1)}x</label>
</div>
