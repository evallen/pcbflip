<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import ViewerPanel from "$lib/ViewerPanel/ViewerPanel.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
</script>

<Splitpanes theme="my-theme" style="height: 100%">
    <Pane minSize={40}>
        <ViewerPanel />
    </Pane>
    <Pane snapSize={10}>
        test panel
        <Input />
    </Pane>
</Splitpanes>

<style>
    @import './SplitPanes.css';
</style>