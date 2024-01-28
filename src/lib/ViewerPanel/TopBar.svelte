<script lang="ts">
    export let selected: null | string = null;

    import { open } from "@tauri-apps/api/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
    import ModeSwitcher from "$lib/misc/ModeSwitcher.svelte";

    async function uploadClicked() {
        selected = await open({
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG',]
            }]
        }) as null | string;
    }
</script>


<div class="flex w-full items-center space-x-2 p-5">
    <Button on:click={uploadClicked}>
        Select image
    </Button>
    <p>{selected ? `${selected} selected` : 'none selected'}</p>

    <ModeSwitcher />
</div>