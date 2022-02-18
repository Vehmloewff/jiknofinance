<script lang="ts">
	import { onDestroy } from 'svelte'
	import { controllers } from '../api'
	import Center from '../components/Center.svelte'
	import Loader from '../components/Loader.svelte'

	import Overlay from '../components/Overlay.svelte'
	import Text from '../components/Text.svelte'
	import { display } from '../services/money'
	import { calculateTimeAgo } from '../services/time-ago'
	import Breakdown from './helpers/Breakdown.svelte'

	export let id: string

	let timeAgoInterval = 0
	const timeAgoIntervalDeclaration = setInterval(() => timeAgoInterval++, 5000)
	onDestroy(() => clearInterval(timeAgoIntervalDeclaration))

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
</script>

<Overlay title="Transaction" allowScroll>
	{#await controllers.transaction.getTransaction(id)}
		<Center>
			<Loader />
		</Center>
	{:then transaction}
		<div class="title">
			<Text content={runCalculateTimeAgo(transaction.date, timeAgoInterval)} style="sub-body" />

			<div class="spacer" />

			<div class="title-content" class:discreet={!transaction.title}>
				<Text content={transaction.title || 'no title'} style="title" />
			</div>

			<div class="spacer" />

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

	.income {
		color: var(--clear);
	}
	.expense {
		color: var(--danger);
	}
</style>
