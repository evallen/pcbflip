<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import ViewerPanel from "$lib/ViewerPanel/ViewerPanel.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
    import HomographyPanel from "$lib/HomographyPanel/HomographyPanel.svelte";
</script>

<Splitpanes theme="my-theme" style="height: 100%">
    <Pane minSize={40}>
        <ViewerPanel />
    </Pane>
    <Pane maxSize={20} size={20} snapSize={10}>
        <HomographyPanel />
    </Pane>
</Splitpanes>

<style>
    @import './SplitPanes.pcss';
</style>