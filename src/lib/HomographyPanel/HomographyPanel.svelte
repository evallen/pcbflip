
<script lang="ts">
	import * as Select from '$lib/components/ui/select';
    import * as Table from '$lib/components/ui/table';
    import { Separator } from '$lib/components/ui/select';
    import Card from '$lib/components/ui/card/card.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { KeyPointStatus, keyPoints, nextKeyPointIdx } from './Homography';
    import { X } from 'lucide-svelte';
	import { dimBackground } from '$lib/ViewerPanel/Canvas.svelte';

    function rowClicked(e: MouseEvent, row: number) {
        $nextKeyPointIdx = row;
        $dimBackground = true;
    }
</script>


<div class="flex flex-col h-full p-5 space-y-3">
    <!-- <p>Homography panel</p> -->
    <Select.Root selected={{value: 'homography', label: 'Homography'}}>
        <Select.Trigger>
            <Select.Value />
        </Select.Trigger>
        <Select.Content>
            <Select.Item value="homography">Homography</Select.Item>
        </Select.Content>
    </Select.Root>

    <Separator />

    <Button>Transform</Button>

    <Card class="flex flex-col p-5 space-y-3">
        <p
        class="scroll-m-20 text-xl tracking-tight">Front Image Key Points</p>
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
                {#each $keyPoints as point, index}
                    <Table.Row 
                        class="transition-none cursor-pointer active:bg-muted {index === $nextKeyPointIdx ? 'bg-muted' : ''}"
                        on:click={e => rowClicked(e, index)}>
                        <Table.Cell>{index}</Table.Cell>
                        <Table.Cell class="text-center">{index === $nextKeyPointIdx ? 'Selecting...' : point.status}</Table.Cell>
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
</div>

<style></style>