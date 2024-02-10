<script lang="ts">
    import ViewerPanel from "$lib/ViewerPanel/ViewerPanel.svelte";
    import RightPanel from "../lib/RightPanel/RightPanel.svelte";

	import { appWindow, PhysicalSize } from '@tauri-apps/api/window';
	import { onMount } from 'svelte';

	onMount(async () => {
		await appWindow.setMinSize(new PhysicalSize(1400, 800));
	});
</script>

<div class="flex flex-row h-full">
    <div class="flex-grow min-w-0">
        <ViewerPanel />
    </div>
    <div class="flex-shrink-0 w-[35rem] min-w-[35rem]" style="border-left: 1px solid hsl(var(--border))">
        <RightPanel />
    </div>
</div>
