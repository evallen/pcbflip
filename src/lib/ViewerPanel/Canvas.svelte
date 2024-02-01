<script lang="ts">
    import { Stage, Layer, Rect, type KonvaMouseEvent } from "svelte-konva";
    import { type Transform } from "./Image.svelte";
	import Konva from "konva";

    export let transform: Transform;
    export let width: number;
    export let height: number;

    let stage: Konva.Stage;
    let mainLayer: Konva.Layer;
    let staticLayer: Konva.Layer;

    let crosshair: { x: Konva.Line | undefined; y: Konva.Line | undefined } = {
        x: undefined,
        y: undefined
    };

    function onclick(e: KonvaMouseEvent) {
        let pointerPos = stage.getRelativePointerPosition();
        if (!pointerPos) return;

        const size = 10;

        let rect = new Konva.Circle({
            x: pointerPos.x,
            y: pointerPos.y,
            width: size,
            height: size, 
            fill: 'red'
        });
        mainLayer.add(rect);
    }

    function onmousemove(e: KonvaMouseEvent) {
        let pointerPos = stage.getPointerPosition();
        let stageSize = stage.getSize();
        if (!pointerPos) return;

        crosshair.x?.points([pointerPos.x, 0, pointerPos.x, stageSize.height]);
        crosshair.y?.points([0, pointerPos.y, stageSize.width, pointerPos.y]);

        x = pointerPos.x;
        y = pointerPos.y;
    }

    function onmouseenter(e: KonvaMouseEvent) {
        let pointerPos = stage.getRelativePointerPosition();
        let stageSize = stage.getSize();
        if (!pointerPos) return;

        let baseConfig = {
            stroke: '#ffffff',
            strokeWidth: 1
        };

        crosshair.x = new Konva.Line({
            ...baseConfig,
            points: [pointerPos.x, 0, pointerPos.x, stageSize.height]
        });

        crosshair.y = new Konva.Line({
            ...baseConfig,
            points: [0, pointerPos.y, stageSize.width, pointerPos.y]
        });

        staticLayer.add(crosshair.x);
        staticLayer.add(crosshair.y);
    }
    
    function onmouseleave(e: KonvaMouseEvent) {
        crosshair.x?.remove();
        crosshair.y?.remove();
    }

    let x = 0;
    let y = 0;
</script>


<Stage config={{ 
    width: width, 
    height: height,
    }}
    bind:handle={stage}
    on:click={onclick}
    on:mousemove={onmousemove}
    on:mouseenter={onmouseenter}
    on:mouseleave={onmouseleave}>
    <Layer config={{
        scale: { x: transform.scale, y: transform.scale },
        x: transform.x, 
        y: transform.y
        }} 
        bind:handle={mainLayer}>
        <Rect config={{ x: 100, y: 100, width: 100, height: 100, fill: 'red', draggable: true }} />
    </Layer>
    <Layer bind:handle={staticLayer}>

    </Layer>
</Stage>

<div style="width: 10px; height: 10px; position: absolute; color: blue; transform: translate({x}px {y}px)">

</div>