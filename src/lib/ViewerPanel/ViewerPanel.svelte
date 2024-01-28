<script lang="ts">
    import Viewer from "./Viewer.svelte";
    import TopBar from "./TopBar.svelte";

    let selected: string | null;
</script>

<div class="flex flex-col h-full">
    <TopBar bind:selected={selected}/>
    <Viewer {selected}/>
</div>

<style></style>