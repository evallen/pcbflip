<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import Sonner from '$lib/components/ui/sonner/sonner.svelte';

</script>

<ModeWatcher />
<Sonner expand={true} richColors toastOptions={{
	style: 'font-weight: 900'
}} />
<div class="absolute inset-0 overflow-hidden">
	<slot />
</div>
