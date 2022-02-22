<script lang="ts">
	import { onDestroy } from 'svelte'
	import { text } from 'svelte/internal'
	import { controllers, FluctuateTransaction } from '../api'
	import Button from '../components/Button.svelte'
	import Center from '../components/Center.svelte'
	import Loader from '../components/Loader.svelte'

	import Overlay from '../components/Overlay.svelte'
	import Text from '../components/Text.svelte'
	import { autofocus } from '../services/autofocus'
	import { display } from '../services/money'
	import { calculateTimeAgo } from '../services/time-ago'
	import Breakdown from './.helpers/Breakdown.svelte'
	import { accountChoiceOverlay, transactionOverlay } from './mod'

	const { id } = transactionOverlay.getParams()

	let timeAgoInterval = 0
	const timeAgoIntervalDeclaration = setInterval(() => timeAgoInterval++, 5000)
	onDestroy(() => clearInterval(timeAgoIntervalDeclaration))

	let renaming = false
	let textField: HTMLInputElement

	// just a simple value to change when the transaction is updated on the server
	// the #key block listens for changes to this and requests the updated version
	// of the transaction from the server
	let transactionChangeKey = 0

	function description(type: string) {
		if (type === 'income') return 'Income Transaction'
		if (type === 'expense') return 'Expense Transaction'
		if (type === 'envelope') return 'Envelope Transfer'

		return 'Location Transfer'
	}

	function runCalculateTimeAgo(date: number, interval: number) {
		// interval is only used to queue the function every ten seconds

		return calculateTimeAgo(date)
	}

	async function allocate() {
		const result = await accountChoiceOverlay.run({ isEnvelope: true, overrideWithIncomeType: false })
		if (!result) return

		try {
			await controllers.transaction.allocateExpenseTransaction({ id, envelopeId: result.id })
			transactionChangeKey++
		} catch (e) {
			alert(`Failed to allocate transaction: ${e.message}`)
			console.error(e)
		}
	}

	async function rename() {
		renaming = false

		try {
			await controllers.transaction.nameTransaction({ id, name: textField.value })
		} catch (e) {
			alert(`Failed to name transaction: ${e.message}`)
			console.error(e)
		}

		transactionChangeKey++
	}
</script>

<Overlay
	title="Transaction"
	allowScroll
	backButtonText={renaming ? 'Cancel' : 'Done'}
	onBackButtonPressed={() => (renaming ? (renaming = false) : transactionOverlay.close(null))}
	actionButtonText={renaming ? 'Save' : 'Rename'}
	boldActionButton={renaming}
	onActionButtonPressed={renaming ? rename : () => (renaming = true)}
>
	{#key transactionChangeKey}
		<div class="no-display">{transactionChangeKey}</div>

		{#await controllers.transaction.getTransaction(id)}
			<Center>
				<Loader />
			</Center>
		{:then transaction}
			<div class="title">
				<Text content={runCalculateTimeAgo(transaction.date, timeAgoInterval)} style="sub-body" />

				{#if renaming}
					<form on:submit|preventDefault={rename} class="rename-form">
						<input use:autofocus type="text" enterkeyhint="done" value={transaction.title} bind:this={textField} />
					</form>
				{:else}
					<div class="spacer" />

					<div class="title-content" class:discreet={!transaction.title}>
						<Text content={transaction.title || 'no title'} style="title" />
					</div>

					<div class="spacer" />
				{/if}

				<Text content={description(transaction.type)} style="sub-body" />

				{#if transaction.type === 'income'}
					<div class="spacer" />

					<div class="income">
						<Text content={display(transaction.amount)} style="small" />
					</div>
				{:else if transaction.type === 'expense'}
					<div class="spacer" />

					<div class="expense">
						<Text content="-{display(transaction.amount)}" style="small" />
					</div>
				{:else}
					<div class="spacer" />

					<Text content={display(transaction.amount)} style="small" />
				{/if}
			</div>

			<div class="container">
				{#if transaction.type === 'income' || transaction.type === 'expense'}
					{#if transaction.envelopeBreakdown.length}
						<Text content="Envelopes" style="header" />

						<div class="spacer" />

						{#each transaction.envelopeBreakdown as breakdown}
							<Breakdown
								{breakdown}
								totalAmount={transaction.amount}
								displayPercentage={transaction.envelopeBreakdown.length > 1}
								isAddition={transaction.type === 'income'}
							/>
						{/each}
					{:else}
						<div class="allocate-header">
							<Text content="Envelopes" style="header" />
							<Button onPressed={allocate} large>
								<Text content="Allocate" />
							</Button>
						</div>

						<div class="spacer" />

						<div class="align-center">
							<Text style="sub-body" content="Not allocated" />
						</div>
					{/if}

					<div class="spacer" />
					<div class="spacer" />

					<Text content="Locations" style="header" />

					<div class="spacer" />

					{#each transaction.locationBreakdown as breakdown}
						<Breakdown
							{breakdown}
							totalAmount={transaction.amount}
							displayPercentage={transaction.locationBreakdown.length > 1}
							isAddition={transaction.type === 'income'}
						/>
					{/each}
				{/if}
			</div>
		{:catch error}
			<Center>
				<Text content={error.message} style="sub-body" />
			</Center>
		{/await}
	{/key}
</Overlay>

<style>
	.title {
		height: 250px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.title-content.discreet {
		opacity: 0.5;
		font-style: italic;
	}

	form.rename-form {
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.income {
		color: var(--clear);
	}
	.expense {
		color: var(--danger);
	}

	.allocate-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
