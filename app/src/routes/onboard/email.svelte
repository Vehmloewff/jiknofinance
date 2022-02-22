<script lang="ts">
	import { onMount } from 'svelte'
	import { controllers, injectHeartbeat } from '../../api'

	import Button from '../../components/Button.svelte'
	import PageView from '../../components/PageView.svelte'
	import Text from '../../components/Text.svelte'

	import { go } from '../../router'

	let email = ''
	let loading = false
	let error: string | null = null
	let inputEl: HTMLInputElement

	function emailIsValid(rawEmail: string) {
		const email = rawEmail.trim()

		if (email === 'demo') return true

		return !email.startsWith('@') && !email.endsWith('@') && email.length > 3 && email.indexOf('@') !== -1 && email.indexOf(' ') === -1
	}

	async function submit() {
		loading = true
		try {
			await controllers.authenticate.sendConfirmationEmail(email)

			if (email === 'demo') injectHeartbeat()

			go('onboard.waiting', { email })
		} catch (e) {
			error = e.message
		}

		loading = false
	}

	onMount(() => {
		inputEl.focus()
	})
</script>

<PageView center>
	<form on:submit|preventDefault={submit}>
		<Text content="Enter your email" style="title" />

		{#if error}
			<div class="spacer" />

			<div class="error">
				<Text content={error} />
			</div>
		{/if}

		<div class="spacer" />

		<input type="email" bind:value={email} placeholder="johndoe@example.com" bind:this={inputEl} />

		<div class="spacer" />

		<div class="action">
			<div class="action-item">
				<Button fullWidth large onPressed={() => go('new-user')}>
					<Text content="Back" style="large-body" />
				</Button>
			</div>

			<div class="action-spacer" />

			<div class="action-item">
				<Button primary fullWidth large submit onPressed={emailIsValid(email) && !loading ? submit : null}>
					<Text content="Next" style="large-body" />
				</Button>
			</div>
		</div>
	</form>
</PageView>

<style>
	form {
		padding: 16px;
	}

	.error {
		background: var(--danger);
		padding: 16px;
		border-radius: 6px;
		width: 264px;
	}

	.action {
		display: flex;
		flex-direction: row;
	}
	.action-item {
		flex-grow: 1;
	}
	.action-spacer {
		width: 16px;
	}
</style>
