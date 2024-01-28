<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="absolute inset-0">
	<slot />
</div>