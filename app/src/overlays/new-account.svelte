<script lang="ts">
	import { controllers } from '../api'

	import Button from '../components/Button.svelte'

	import Overlay from '../components/Overlay.svelte'
	import Text from '../components/Text.svelte'
	import { autofocus } from '../services/autofocus'
	import { newAccountOverlay } from './mod'

	const { isEnvelope } = newAccountOverlay.getParams()
	const label = isEnvelope ? 'New Envelope' : 'New Location'

	let name = ''
	let loading = false

	$: invalid = !name.length || loading

	async function save() {
		loading = true

		try {
			if (isEnvelope) await controllers.envelopes.createNewEnvelope(name)
			else await controllers.locations.createNewLocation(name)

			newAccountOverlay.close(null)
		} catch (e) {
			alert(`Failed to create account: ${e.message}`)
		}

		loading = false
	}
</script>

<Overlay
	onBackButtonPressed={() => newAccountOverlay.close(null)}
	title={label}
	actionButtonText="Save"
	actionButtonDisabled={invalid}
	onActionButtonPressed={save}
	center
>
	<form on:submit|preventDefault={save}>
		<Text content="Name this {isEnvelope ? 'envelope' : 'location'}" style="title" />

		<div class="spacer" />

		<input
			use:autofocus
			bind:value={name}
			type="text"
			placeholder={isEnvelope ? "Jake's Spending" : 'Bank Account'}
			enterkeyhint="done"
		/>

		<div class="spacer" />

		<div class="actions">
			<div class="action">
				<Button fullWidth onPressed={() => newAccountOverlay.close(null)} large>
					<Text content="Cancel" />
				</Button>
			</div>

			<div class="spacer-x" />

			<div class="action">
				<Button fullWidth submit primary onPressed={invalid ? null : () => save()} large>
					<Text content="Save" />
				</Button>
			</div>
		</div>
	</form>
</Overlay>

<style>
	.actions {
		display: flex;
	}
	.action {
		flex-grow: 1;
		flex-basis: 20px;
	}
</style>
