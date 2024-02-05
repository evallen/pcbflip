<script lang="ts" context="module">
    import { type Writable, writable } from 'svelte/store';

    export let dimBackground: Writable<boolean> = writable(false);
</script>

<script lang="ts">
	import { Stage, Layer, type KonvaMouseEvent, type KonvaDragTransformEvent, Rect } from 'svelte-konva';
	import { type Transform } from './Image.svelte';
	import Konva from 'konva';
	import { KeyPointStatus, keyPoints, setNextKeyPoint } from '$lib/HomographyPanel/Homography';
	import type { Vector2d } from '$lib/misc/types';

	export let transform: Transform;
	export let width: number;
	export let height: number;

	let stage: Konva.Stage;
	let mainLayer: Konva.Layer;
	let bottomStaticLayer: Konva.Layer;
    let markers: Konva.Group[] = [];

	$: transform.scale, fixScales();

	function fixScales() {
		mainLayer?.getChildren().forEach((n) =>
			n.setAttrs({
				scaleX: 1 / transform.scale,
				scaleY: 1 / transform.scale
			})
		);
	}
    

    keyPoints.subscribe(points => {
        markers.forEach(marker => marker.remove());
        markers = points
                    .filter(point => point.status === KeyPointStatus.Set)
                    .map((point, idx) => createMarker(point.pos, idx.toString()));
        markers.forEach(marker => mainLayer?.add(marker));

        fixScales();
    });

    function createMarker(pos: Vector2d, labelStr: string) {
		const size = 60;

		let marker = new Konva.Group({
			x: pos.x,
			y: pos.y,
			draggable: true
		});

		let vertLine = new Konva.Line({
			points: [0, -size / 2, 0, size / 2],
			stroke: 'white',
			strokeWidth: 2,
			strokeScaleEnabled: false
		});

		let horLine = new Konva.Line({
			points: [-size / 2, 0, size / 2, 0],
			stroke: 'white',
			strokeWidth: 2,
			strokeScaleEnabled: false
		});

		let circ = new Konva.Circle({
			x: 0,
			y: 0,
			width: size * 0.2,
			height: size * 0.2,
			stroke: 'white',
			strokeWidth: 2
		});

		let bgCirc = new Konva.Circle({
			x: 0,
			y: 0,
			width: size,
			height: size,
			fill: 'rgba(0,0,0,0)'
		});

		marker.on('mousemove', () => {
			bgCirc.fill('rgba(0,0,0,0.2)');
			stage.container().style.cursor = 'move';
		});

		marker.on('mouseout', () => {
			bgCirc.fill('rgba(0,0,0,0)');
			stage.container().style.cursor = 'inherit';
		});

		let label = new Konva.Text({
			x: size * 0.2,
			y: -size * 0.4,
			text: labelStr.toString(),
			stroke: 'white'
		});

		marker.add(bgCirc);
		marker.add(vertLine);
		marker.add(horLine);
		marker.add(circ);
		marker.add(label);

        return marker;
    }

	function onclick(e: KonvaMouseEvent) {
		let pointerPos = mainLayer.getRelativePointerPosition();
		if (!pointerPos) return;

		setNextKeyPoint(pointerPos);
	}
</script>

<Stage
	config={{
		width: width,
		height: height
	}}
	bind:handle={stage}
	on:click={onclick}
>
	<Layer bind:handle={bottomStaticLayer}>
        {#if $dimBackground}
            <Rect config={{
                x: 0,
                y: 0,
                width: width,
                height: height,
                fill: 'rgba(0,0,0,0.5)',
            }} />
        {/if}
    </Layer>
	<Layer
		config={{
			scale: { x: transform.scale, y: transform.scale },
			x: transform.x,
			y: transform.y
		}}
		bind:handle={mainLayer}
	></Layer>
	<Layer bind:handle={bottomStaticLayer}></Layer>
</Stage>
