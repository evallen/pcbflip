<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
	import KeyPointsCard from './KeyPointsCard.svelte';
    import { frontKeyPoints, backKeyPoints } from './Homography';
    import HomographyRenderer from './HomographyRenderer.svelte';
</script>

<HomographyRenderer />
<Button disabled aria-disabled>Transform</Button>
<KeyPointsCard title="Front Image Key Points" keyPoints={frontKeyPoints}/>
<KeyPointsCard title="Back Image Key Points" keyPoints={backKeyPoints}/>