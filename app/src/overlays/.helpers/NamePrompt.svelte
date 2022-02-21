<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '../../components/Button.svelte'
	import Text from '../../components/Text.svelte'

	export let onDone: () => void
	export let name = ''

	let textField: HTMLInputElement

	onMount(() => textField.focus())

	function submit() {
		onDone()
	}
</script>

<form on:submit|preventDefault={submit}>
	<Text content="Name this transaction" style="title" />

	<div class="spacer" />

	<input type="text" bind:this={textField} bind:value={name} enterkeyhint="done" />

	<div class="spacer" />

	<div class="actions">
		<div class="action">
			<Button fullWidth large onPressed={() => (name = '' && onDone())}>
				<Text content="Skip" />
			</Button>
		</div>

		<div class="spacer-x" />

		<div class="action">
			<Button fullWidth large onPressed={name.length ? () => onDone() : null}>
				<Text content="Save" />
			</Button>
		</div>
	</div>
</form>

<style>
	.actions {
		display: flex;
	}
	.action {
		flex-grow: 1;
		flex-basis: 20px;
	}
</style>
