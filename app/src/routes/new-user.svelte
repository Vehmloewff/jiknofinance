<script lang="ts">
	import { fade } from 'svelte/transition'
	import { online } from '../api'

	import Button from '../components/Button.svelte'
	import Center from '../components/Center.svelte'
	import Scaffold from '../components/Scaffold.svelte'
	import Text from '../components/Text.svelte'

	import { go } from '../router'
</script>

<Scaffold inAnimation={null}>
	<Center>
		{#if $online}
			<div class="body" in:fade={{ delay: 500 }}>
				<div class="img-proto">
					<Text content="Jikno Finance" style="title" />
					<div class="spacer" />
					<Text content="Finances ...Redone." style="subtitle" />
				</div>

				<div class="actions">
					<div>
						<Button onPressed={() => go('onboard.email')} primary large>
							<Text content="Get Started" style="large-body" />
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</Center>
</Scaffold>

<style>
	.body {
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.img-proto {
		margin: 32px;
		font-size: 20px;
		text-align: center;
	}

	.actions {
		text-align: center;
		margin: 32px;
	}
	.spacer {
		height: 16px;
	}
</style>
