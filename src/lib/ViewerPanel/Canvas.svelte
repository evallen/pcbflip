<script lang="ts">
	import { Stage, Layer, type KonvaMouseEvent, Rect } from 'svelte-konva';
	import { type Transform } from './Image.svelte';
	import Konva from 'konva';
	import { frontKeyPoints } from '../RightPanel/HomographyPanel/Homography';

	// --- Props ---------------------------------------------------------------
	export let transform: Transform;
	export let width: number;
	export let height: number;

	// --- Canvas context ------------------------------------------------------
	let stage: Konva.Stage;
	let mainLayer: Konva.Layer;
	let bottomStaticLayer: Konva.Layer;
	let topStaticLayer: Konva.Layer;

	// --- Other variables -----------------------------------------------------
	let _dimBackground: boolean = false;

	type ClickListener = (e: KonvaMouseEvent) => void;
	let clickListeners: ClickListener[] = [];

	// --- Public functions ----------------------------------------------------
	export function getContext() {
		return {
			stage,
			bottomStaticLayer,
			mainLayer,
			topStaticLayer
		};
	}

	export function dimBackground(value: boolean) {
		_dimBackground = value;
	}

	export function fixScales() {
		mainLayer?.getChildren().forEach((n) =>
			n.setAttrs({
				scaleX: 1 / transform.scale,
				scaleY: 1 / transform.scale
			})
		);
	}

	export function addClickListener(listener: ClickListener) {
		clickListeners.push(listener);
	}

	export function removeClickListener(listener: ClickListener) {
		let idx = clickListeners.indexOf(listener);
		if (!idx) return;

		clickListeners.splice(idx, 1);
	}

	// --- Reactive declarations -----------------------------------------------
	// Whenever the scale changes, ensure main layer elements stay
	// the same size.
	$: transform.scale, fixScales();

	// --- Event listeners -----------------------------------------------------
	function onclick(e: KonvaMouseEvent) {
		let pointerPos = mainLayer.getRelativePointerPosition();
		if (!pointerPos) return;

		clickListeners.forEach(listener => listener(e));
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
		{#if _dimBackground}
			<Rect
				config={{
					x: 0,
					y: 0,
					width: width,
					height: height,
					fill: 'rgba(0,0,0,0.5)'
				}}
			/>
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
	<Layer bind:handle={topStaticLayer}></Layer>
</Stage>
