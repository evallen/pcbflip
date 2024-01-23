<script>
    import { invoke } from "@tauri-apps/api/tauri";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";

    let name = '';
    let greetMsg = '';

    async function greet() {
        greetMsg = await invoke('greet', { name })
    }
</script>

<div>
    <Input on:keydown={(e) => { if (e.key === "Enter") greet() }} placeholder="Enter a name..." bind:value="{name}" id="greet-input" />
    <Button on:click="{greet}">Greet</Button>
    <p>{greetMsg}</p>
</div>

<style>
    div {
        display: grid;
        grid-template-columns: 1fr 5em;
    }
</style>