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

    let stage: Konva.Stage
    let bottomLayer: Konva.Layer

    const scaleBy = 1.20;
    function canvasZoom(event: WheelEvent) {
        let oldScale = stage.scaleX();
        let pointer = stage.getPointerPosition();

        let mousePointTo = {
            x: (pointer!.x - stage.x()) / oldScale,
            y: (pointer!.y - stage.y()) / oldScale,
        }

        // decide zoom in or out
        let direction = event.deltaY > 0 ? -1 : 1;
        console.log(event.deltaY);
        let thisScaleBy = scaleBy ** (Math.abs(event.deltaY) / 78);

        let newScale = direction > 0 ? oldScale * thisScaleBy : oldScale / thisScaleBy;

        stage.scale({ x: newScale, y: newScale });

        let newPos = {
            x: pointer!.x - mousePointTo.x * newScale,
            y: pointer!.y - mousePointTo.y * newScale,
        }
        stage.position(newPos);
    }

    let scrollRate = 0.5;
    function wheelHandler(e: CustomEvent) {
        let event: WheelEvent = e.detail.evt;

        if (event.ctrlKey) {
            canvasZoom(event);
            return;
        }

        let x = stage.x();
        let y = stage.y();
        
        stage.x(x - scrollRate * event.deltaX);
        stage.y(y - scrollRate * event.deltaY);
    }

    let canvasContainerWidth = 0, canvasContainerHeight = 0;

    $: resizeCanvas(canvasContainerWidth, canvasContainerHeight);

    function resizeCanvas(width: number, height: number) {
        console.log(`resize canvas ${width} x ${height}`);
        stage?.width(width);
        stage?.height(height);
        console.log(stage);
    }
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
            <div 
                id="canvasContainer" 
                class="overflow-auto min-h-0 h-full" 
                bind:clientWidth={canvasContainerWidth}
                bind:clientHeight={canvasContainerHeight}
                on:wheel={ (e) => { if (e.ctrlKey) e.preventDefault() }}>
                <Stage 
                    config={{ draggable: true }} 
                    bind:handle={stage} 
                    style="width: 100%, height: 100%"
                    on:wheel={wheelHandler}>
                    <Layer bind:handle={bottomLayer}>
                        <!-- stuff here -->
                    </Layer>
                    <Layer>
                        <Image config={{ image, perfectDrawEnabled: false }} />
                    </Layer> 
                </Stage>
            </div>
        </div>
    </Pane>
    <Pane>5</Pane>
</Splitpanes>