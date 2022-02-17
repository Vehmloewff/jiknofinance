<!-- It appears that setting css variables from JS does not work in Webkit -->
<script lang="ts">
	// export let size = 80

	// const borderRatio = 4 / 80
	// const minSizeRatio = 36 / 80
	// const maxSizeRatio = 72 / 80

	// $: borderWidth = size * borderRatio
	// $: minSize = size * minSizeRatio
	// $: maxSize = size * maxSizeRatio

	// let rippleEl: HTMLDivElement

	// $: {
	// 	if (!rippleEl) break $

	// 	rippleEl.style.setProperty('--size', `${size}px`)
	// 	rippleEl.style.setProperty('--border-width', `${borderWidth}px`)
	// 	rippleEl.style.setProperty('--min-size', `${minSize}px`)
	// 	rippleEl.style.setProperty('--max-size', `${maxSize}px`)
	// }
</script>

<!-- <div class="lds-ripple" bind:this={rippleEl} style="width: {size}px; height: {size}px;">
	<div />
	<div />
</div> -->
<div class="lds-circle"><div /></div>

<style>
	.lds-circle {
		display: inline-block;
		transform: translateZ(1px);
	}
	.lds-circle > div {
		display: inline-block;
		width: 30px;
		height: 30px;
		margin: 8px;
		border-radius: 50%;
		background: var(--action);
		animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}
	@keyframes lds-circle {
		0%,
		100% {
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		0% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(1800deg);
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		100% {
			transform: rotateY(3600deg);
		}
	}
</style>
