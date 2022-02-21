<script lang="ts">
	import { onDestroy } from 'svelte'
	import Loader from './components/Loader.svelte'
	import Text from './components/Text.svelte'

	let showHelpMessage = false

	let timeout = setTimeout(() => (showHelpMessage = true), 5000)

	onDestroy(() => clearTimeout(timeout))
</script>

<div class="splash">
	<Loader />

	<div class="help" class:visible={showHelpMessage}>
		<Text content="We're having trouble connecting to the internet" style="sub-body" />
	</div>
</div>

<style>
	.splash {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 10;
		background: var(--background);
	}

	.help {
		opacity: 0;
		transition: opacity 300ms;
	}

	.help.visible {
		opacity: 1;
	}
</style>
