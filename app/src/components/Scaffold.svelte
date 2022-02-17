<script lang="ts">
	import { fade, fly } from 'svelte/transition'

	export let inAnimation: 'fade' | 'up' | 'down' | 'right' | 'left' | 'auto' | null = 'auto'
	export let outAnimation: 'fade' | 'up' | 'down' | 'right' | 'left' | null = null
	export let inDelay = 0
	export let outDelay = 0

	let windowHeight: number
	let windowWidth: number

	function inferInAnimation() {
		if (inAnimation !== 'auto') return inAnimation

		return 'fade'
	}

	function inFn(element: Element, _: {}) {
		const type = inferInAnimation()

		if (type === 'fade') return fade(element, { delay: inDelay })
		else if (type === 'down') return fly(element, { delay: inDelay })
		else if (type === 'up') return fly(element, { delay: inDelay })
		else if (type === 'left') return fly(element, { delay: inDelay })
		else if (type === 'right') return fly(element, { x: windowWidth, delay: inDelay })
	}

	function outFn(element: Element, _: {}) {
		if (outAnimation === 'fade') return fade(element, { delay: outDelay })
		else if (outAnimation === 'down') return fly(element, { delay: outDelay })
		else if (outAnimation === 'up') return fly(element, { delay: outDelay })
		else if (outAnimation === 'left') return fly(element, { delay: outDelay })
		else if (outAnimation === 'right') return fly(element, { delay: outDelay })
	}
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<div class="scaffold" in:inFn out:outFn>
	<slot />
</div>

<style>
	.scaffold {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
		z-index: 1;
	}
</style>
