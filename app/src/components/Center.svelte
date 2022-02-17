<script type="ts">
	let childHeight: number
	let childWidth: number
	let parentHeight: number
	let parentWidth: number

	$: paddingTop = (parentHeight - childHeight) / 2
	$: paddingLeft = (parentWidth - childWidth) / 2
</script>

<div
	class="center"
	bind:clientHeight={parentHeight}
	bind:clientWidth={parentWidth}
	style="
		padding-top: {paddingTop}px; 
		padding-left: {paddingLeft}px;
		width: calc(100% - {paddingLeft}px;
		height: calc(100% - {paddingTop}px;"
>
	<div class="centered" bind:clientHeight={childHeight} bind:clientWidth={childWidth}>
		<slot />
	</div>
</div>

<style>
	.center {
		width: 100%;
		height: 100%;
		float: left;
	}
	.centered {
		float: left;
	}
</style>
