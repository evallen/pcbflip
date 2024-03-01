<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
	import KeyPointsCard from './KeyPointsCard.svelte';
    import { frontKeyPoints, backKeyPoints } from './Homography';
    // @ts-ignore
    import { Homography } from 'homography';
    import HomographyRenderer, { editBackKeyPointsMode, editFrontKeyPointsMode } from './HomographyRenderer.svelte';
	import { viewerContext } from '$lib/ViewerPanel/Viewer.svelte';

    function transformBtnClicked() {
        // const srcPoints = [[1933, 946], [522, 1395], [457, 3373], [2563, 3345]]
        // const dstPoints = [[1161, 1012], [2464, 1412], [2564, 3260], [567, 3255]]
        const srcPoints = $backKeyPoints.points.map(pt => [pt.pos.x, pt.pos.y])
        const dstPoints = $frontKeyPoints.points.map(pt => [pt.pos.x, pt.pos.y])

        const myHomography = new Homography();
        $viewerContext.backImageMatrix = myHomography.getTransformationMatrixAsCSS(srcPoints, dstPoints);
        console.log($viewerContext.backImageMatrix); 
    }
</script>

<HomographyRenderer />
<Button
        on:click={transformBtnClicked}>Transform</Button>
<KeyPointsCard 
    title="Front Image Key Points" 
    keyPoints={frontKeyPoints}
    editMode={editFrontKeyPointsMode}/>
<KeyPointsCard 
    title="Back Image Key Points" 
    keyPoints={backKeyPoints}
    editMode={editBackKeyPointsMode}/>