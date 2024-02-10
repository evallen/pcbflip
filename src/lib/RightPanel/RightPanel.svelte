<script lang="ts">
	import * as Select from '$lib/components/ui/select';
    import { Separator } from '$lib/components/ui/select';
	import HomographyPanel from './HomographyPanel/HomographyPanel.svelte';
</script>


<div class="flex flex-col h-full p-5 space-y-3 overflow-y-auto overflow-x-hidden">
    <Select.Root selected={{value: 'homography', label: 'Homography'}}>
        <Select.Trigger>
            <Select.Value />
        </Select.Trigger>
        <Select.Content>
            <Select.Item value="homography">Homography</Select.Item>
        </Select.Content>
    </Select.Root>

    <Separator />

    <HomographyPanel />
</div>