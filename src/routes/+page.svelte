<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import { open } from "@tauri-apps/api/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
	import { convertFileSrc } from "@tauri-apps/api/tauri";

    let selected: null | string = null;
    let image: HTMLImageElement | undefined;
    let imageWidth = 0;
    let imageHeight = 0;
    let containerWidth = 0;
    let containerHeight = 0;

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
            imageWidth = img.width;
            imageHeight = img.height;
            img.onload = () => {
                image = img;
            }
        }
    }

    function getImageMousePos(event: MouseEvent) {
        if (!image) return;

        let target = event.currentTarget as HTMLElement;

        let bounds = target.getBoundingClientRect();
        let imageCoords = {x: event.clientX - bounds.left - imageLeft, y: event.clientY - bounds.top - imageTop};

        return imageCoords;
    }


    let scaleBy = 1.20;
    function wheelHandler(event: WheelEvent) {
        if (!event.ctrlKey) {
            return;
        }
        if (!image) return;

        event.preventDefault();
        let target = event.currentTarget as HTMLElement;

        let actualScaleBy = scaleBy ** (-event.deltaY / 78);
        imageWidth *= actualScaleBy;
        imageHeight *= actualScaleBy;

        let imageCoords = getImageMousePos(event);

        // new coords = old coords * scale
        // new coords - old coords = old coords * scale - old coords
        // diff = old coords * (scale - 1)
        let diffX = imageCoords!.x * (actualScaleBy - 1);
        let diffY = imageCoords!.y * (actualScaleBy - 1);
        target.scrollBy(diffX, diffY)
    }

    $: console.log({imageWidth, imageHeight});
    
    let imageLeft = 0;
    let imageTop = 0;
    // let imageTransform = "translate(0, 0)";

    function fixImage() {
        if (imageWidth < containerWidth) {
            imageLeft = (containerWidth / 2) - (imageWidth / 2);
        } else {
            imageLeft = 0;
        }

        if (imageHeight < containerHeight) {
            imageTop = (containerHeight / 2) - (imageHeight / 2);
        } else {
            imageTop = 0;
        }
    }

    $: imageWidth, imageHeight, containerWidth, containerHeight, fixImage();

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


            <div id="canvasContainer" class="relative overflow-auto min-h-0 h-full no-flicker"
                 on:wheel={wheelHandler}
                 bind:clientWidth={containerWidth}
                 bind:clientHeight={containerHeight}>
                {#if selected}
                    <img src="{selected}" class="no-flicker" alt="pic" style:width={imageWidth}px style:height={imageHeight}px
                         style:left={imageLeft}px style:top={imageTop}px />
                {/if}
            </div>
        </div>
    </Pane>
    <Pane>5</Pane>
</Splitpanes>

<style>
    .no-flicker {
        image-rendering: pixelated;
    }

    img {
        max-width: none;
        position: absolute;
    }

</style>