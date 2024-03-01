<script lang="ts">
    import Card from "$lib/components/ui/card/card.svelte";
    import * as Table from '$lib/components/ui/table';
    import { KeyPointStatus, KeyPointCollection } from './Homography';
    import { X } from 'lucide-svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { type Writable } from "svelte/store";
    import { switchToMode, cancelMode, getCurrentMode, currentModeChanged, type Mode } from "$lib/ViewerPanel/Viewer.svelte";

    export let title: String;
    export let keyPoints: Writable<KeyPointCollection>;
    export let editMode: Mode;

    let currentMode: Mode | null;
    $: $currentModeChanged, currentMode = getCurrentMode();

    function rowClicked(e: MouseEvent, row: number) {
        $keyPoints.nextPointIndex = row;
        switchToMode(editMode);
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key == "Escape") {
            $keyPoints.nextPointIndex = null;
            cancelMode();
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />
<Card class="flex flex-col p-5 space-y-3">
    <div class="flex flex-row">
        <p
        class="scroll-m-20 text-xl tracking-tight">{title}</p>
        <Button 
        on:click={(e) => {
            if (currentMode === editMode) {
                cancelMode();
            } else {
                switchToMode(editMode)
            }
        }}
        class="ml-auto" variant="outline">
            {currentMode === editMode ? 'Cancel (Esc)' : 'View'}
        </Button>
    </div>
    <Table.Root>
        <Table.Header>
            <Table.Row class="transition-none">
                <Table.Head>Point #</Table.Head>
                <Table.Head class="text-center">Status</Table.Head>
                <Table.Head class="text-center">Position</Table.Head>
                <Table.Head></Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each $keyPoints.points as point, index}
                <Table.Row 
                    class="transition-none cursor-pointer active:bg-muted {index === $keyPoints.nextPointIndex ? 'bg-muted' : ''}"
                    on:click={e => rowClicked(e, index)}>
                    <Table.Cell>{index}</Table.Cell>
                    <Table.Cell class="text-center">{index === $keyPoints.nextPointIndex ? 'Selecting...' : point.status}</Table.Cell>
                    <Table.Cell class="text-center">({point.pos.x.toFixed(0)}, {point.pos.y.toFixed(0)})</Table.Cell>
                    <Table.Cell class="text-right">
                        {#if point.status === KeyPointStatus.Set}
                            <Button 
                                on:click={ e => {
                                    point.status = KeyPointStatus.Unset;
                                    point.pos = { x: 0, y: 0};
                                    e.stopPropagation();
                                }} 
                                variant="outline" 
                                size="icon" 
                                class="bg-transparent">
                                <X />
                            </Button>
                        {/if}
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</Card>