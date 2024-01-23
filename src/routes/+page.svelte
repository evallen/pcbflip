<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import { Stage, Layer, Image, Circle } from "svelte-konva";
	import { onMount, tick } from "svelte";
    import { open } from "@tauri-apps/api/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
	import { convertFileSrc } from "@tauri-apps/api/tauri";
	import Konva from "konva";

    let selected: null | string = null;
    let image: HTMLImageElement | undefined;
    async function uploadClicked() {
        selected = await open({
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG',]
            }]
        }) as null | string;

        if (selected) {
            selected = convertFileSrc(selected);

            const img = document.createElement("img");
            img.src = selected;
            img.onload = () => {
                image = img;
            }
        }
    }

    let pcbTransform = {
        translation: {
            x: 0,
            y: 0
        }, 
        scale: 1
    };
    let pcbTransformStr = `scale(${pcbTransform.scale}) translate(${pcbTransform.translation.x} ${pcbTransform.translation.y})`

    let scaleBy = 1.20;
    function wheelHandler(event: WheelEvent) {
        if (!event.ctrlKey) {
            return;
        }

        event.preventDefault();

        pcbTransform.scale *= scaleBy ** (event.deltaY / 78);
        pcbTransformStr = `scale(${pcbTransform.scale}) translate(${pcbTransform.translation.x} ${pcbTransform.translation.y})`
        console.log("transforming ");
        console.log(pcbTransformStr);
    }

    $: console.log(pcbTransform);

</script>

<Splitpanes style="height: 100%">
    <Pane minSize={20}>
        <div class="flex flex-col h-full">
            <div class="flex w-full items-center space-x-2 p-5">
                <Button on:click={uploadClicked}>
                    Select image
                </Button>
                <p>{selected ? `${selected} selected` : 'none selected'}</p>
            </div>
            <!-- <div 
                id="canvasContainer" 
                class="overflow-auto min-h-0 h-full" 
                on:wheel={ (e) => { if (e.ctrlKey) e.preventDefault() }}>
                <Stage 
                    config={{ width: 5000, height: 4000, draggable: true }} 
                    bind:handle={stage} 
                    style="width: 100%, height: 100%"
                    on:wheel={wheelHandler}>
                    <Layer bind:handle={bottomLayer}>
                    </Layer>
                    <Layer>
                        <Image config={{ image, perfectDrawEnabled: false }} />
                    </Layer> 
                </Stage>
            </div> -->

            <div id="canvasContainer" class="overflow-auto min-h-0 h-full no-flicker"
                 on:wheel={wheelHandler}>
                {#if selected}
                    <img src="{selected}" class="no-flicker" alt="pic" style:transform={ `scale(${pcbTransform.scale})` } />
                {/if}
            </div>
        </div>
    </Pane>
    <Pane>5</Pane>
</Splitpanes>

<style>
    .no-flicker {
        image-rendering: pixelated;
       transform-style: preserve-3d; backface-visibility: hidden;  
       /* perspective: 1000; */
       /* transition:all 0.1s ease-in-out; */
       /* filter: blur(0); */
       /* transform: translate3d(0,0,0); */
       -webkit-transform-style: preserve-3d; -webkit-backface-visibility: hidden;  
       /* -webkit-perspective: 1000; */
       /* -webkit-transition:all 0.1s ease-in-out; */
       /* -webkit-filter: blur(0); */
       /* -webkit-transform: translate3d(0,0,0); */
       /* -moz-backface-visibility:    hidden; */
        /* /* -ms-backface-visibility:     hidden; */
    }
</style>