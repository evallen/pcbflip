<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import ViewerPanel from "$lib/ViewerPanel/ViewerPanel.svelte";
</script>

<Splitpanes theme="my-theme" style="height: 100%">
    <Pane minSize={40}>
        <ViewerPanel />
    </Pane>
    <Pane minSize={40}>
        test panel
    </Pane>
</Splitpanes>

<style>
    @import './SplitPanes.css';
</style>