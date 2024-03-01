<script lang="ts" context="module">
	export let editFrontKeyPointsMode: Mode = {
		context: {},
		begin() {
			frontKeyPoints.update((coll) => {
				coll.show = true;
				return coll;
			});
			viewerContext.update((ctx) => {
				ctx.frontImageOpacity = 1;
				ctx.backImageOpacity = 0;
				return ctx;
			});
			canvas.dimBackground(true);
		},
		undo() {
			frontKeyPoints.update((coll) => {
				coll.show = false;
				coll.nextPointIndex = null;
				return coll;
			});
			canvas.dimBackground(false);
		}
	};

	export let editBackKeyPointsMode: Mode = {
        context: {},
		begin() {
			backKeyPoints.update((coll) => {
				coll.show = true;
				return coll;
			});
            viewerContext.update((ctx) => {
                ctx.frontImageOpacity = 0;
                ctx.backImageOpacity = 1;
                return ctx;
            })
			canvas.dimBackground(true);
		},
		undo() {
			backKeyPoints.update((coll) => {
				coll.show = false;
				return coll;
			});
			canvas.dimBackground(false);
		}
	};
</script>

<script lang="ts">
	import Viewer, { canvas, viewerContext, type Mode, getCurrentMode } from '$lib/ViewerPanel/Viewer.svelte';
	import { frontKeyPoints, backKeyPoints, KeyPointStatus, KeyPointCollection } from './Homography';
	import Konva from 'konva';
	import type { Vector2d } from '$lib/misc/types';
	import { onMount } from 'svelte';
	import type { KonvaMouseEvent } from 'svelte-konva';

	let markers: Konva.Group[] = [];

	onMount(() => {
		frontKeyPoints.subscribe((frontKeyPoints) => {
			if (!canvas) return;

			let ctx = canvas.getContext();
			let mainLayer = ctx.mainLayer;
			let stage = ctx.stage;

			markers.forEach((marker) => marker.remove());

			if (frontKeyPoints.show) {
				markers = frontKeyPoints.points
					.filter((point) => point.status === KeyPointStatus.Set)
					.map((point, idx) => createMarker(point.pos, idx.toString(), stage));
				markers.forEach((marker) => mainLayer.add(marker));
			}

			canvas.fixScales();
		});

		backKeyPoints.subscribe((backKeyPoints) => {
			if (!canvas) return;

			let ctx = canvas.getContext();
			let mainLayer = ctx.mainLayer;
			let stage = ctx.stage;

			markers.forEach((marker) => marker.remove());

			if (backKeyPoints.show) {
				markers = backKeyPoints.points
					.filter((point) => point.status === KeyPointStatus.Set)
					.map((point, idx) => createMarker(point.pos, idx.toString(), stage));
				markers.forEach((marker) => mainLayer.add(marker));
			}

			canvas.fixScales();
		});

		canvas.addClickListener(onclick);
	});

	function onclick(e: KonvaMouseEvent) {
		let mainLayer = canvas.getContext().mainLayer;
		let pointerPos = mainLayer.getRelativePointerPosition();
		if (!pointerPos) return;

        switch (getCurrentMode()) {
            case editFrontKeyPointsMode:
                $frontKeyPoints.setNextKeyPoint(pointerPos);
                $frontKeyPoints = $frontKeyPoints;
                break;
            case editBackKeyPointsMode:
                $backKeyPoints.setNextKeyPoint(pointerPos);
                $backKeyPoints = $backKeyPoints;
                break;
        }
	}

	function createMarker(pos: Vector2d, labelStr: string, stage: Konva.Stage) {
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
</script>
