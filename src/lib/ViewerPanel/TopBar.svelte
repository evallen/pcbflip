<script lang="ts">
    export let frontSelected: null | string = null;
    export let backSelected: null | string = null;

    import { open } from "@tauri-apps/api/dialog";
	import Button from "$lib/components/ui/button/button.svelte";
    import ModeSwitcher from "$lib/misc/ModeSwitcher.svelte";

    async function frontUploadClicked() {
        frontSelected = await open({
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG',]
            }]
        }) as null | string;
    }

    async function backUploadClicked() {
        backSelected = await open({
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG',]
            }]
        }) as null | string;
    }
</script>


<div class="flex w-full items-center space-x-2 p-2 border-b-[1px]">
    <Button on:click={frontUploadClicked}>
        Select front image
    </Button>
    <p>{frontSelected ? `${frontSelected} selected` : 'none selected'}</p>

    <Button on:click={backUploadClicked}>
        Select back image
    </Button>
    <p>{backSelected ? `${backSelected} selected` : 'none selected'}</p>

    <ModeSwitcher />
</div>