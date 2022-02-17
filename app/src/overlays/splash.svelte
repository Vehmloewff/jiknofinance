<script lang="ts">
	import { onDestroy } from 'svelte'

	import Center from '../components/Center.svelte'
	import Loader from '../components/Loader.svelte'
	import Scaffold from '../components/Scaffold.svelte'
	import Text from '../components/Text.svelte'

	let showHelpMessage = false

	let timeout = setTimeout(() => (showHelpMessage = true), 5000)

	onDestroy(() => clearTimeout(timeout))
</script>

<Scaffold outAnimation="fade">
	<Center>
		<div class="splash">
			<Loader />

			<div class="help" class:visible={showHelpMessage}>
				<Text content="We're having troubble connecting to the internet" style="sub-body" />
			</div>
		</div>
	</Center>
</Scaffold>

<style>
	.splash {
		text-align: center;
	}

	.help {
		opacity: 0;
		transition: opacity 300ms;
	}

	.help.visible {
		opacity: 1;
	}
</style>
