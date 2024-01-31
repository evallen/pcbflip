<script lang="ts">
    import Viewer from "./Viewer.svelte";
    import TopBar from "./TopBar.svelte";
	import BottomBar from "./BottomBar.svelte";
    let frontSelected: string | null;
    let backSelected: string | null;
    let scale: number;
</script>

<div class="flex flex-col h-full">
    <TopBar bind:frontSelected bind:backSelected/>
    <Viewer {frontSelected} {backSelected} bind:scale={scale}/>
    <BottomBar bind:zoom={scale}/>
</div>

<style></style>