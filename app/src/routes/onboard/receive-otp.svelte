<script lang="ts">
	import { onMount } from 'svelte'

	import { controllers, injectHeartbeat } from '../../api'

	import Button from '../../components/Button.svelte'
	import Center from '../../components/Center.svelte'
	import Loader from '../../components/Loader.svelte'
	import Scaffold from '../../components/Scaffold.svelte'
	import Text from '../../components/Text.svelte'
	import { go } from '../../router'

	export let otp: string

	let error: string | null = null

	onMount(async () => {
		try {
			await controllers.authenticate.verifyOtp(otp)
			injectHeartbeat()
		} catch (e) {
			error = e.message
			console.error(e)
		}
	})
</script>

<Scaffold>
	<Center>
		<div class="content">
			{#if error}
				<Text content="Oops!" style="title" />

				<div class="spacer" />

				<Text content={error} />

				<div class="spacer" />
				<div class="spacer" />

				<Button large onPressed={() => go('onboard.email')}>
					<Text content="Back" />
				</Button>
			{:else}
				<Loader size={30} />
			{/if}
		</div>
	</Center>
</Scaffold>

<style>
	.content {
		padding: 16px;
		text-align: center;
	}
</style>
