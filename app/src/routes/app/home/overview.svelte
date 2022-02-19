<script lang="ts">
	import { onDestroy } from 'svelte'
	import { controllers } from '../../../api'
	import Icon from '../../../components/Icon.svelte'
	import List from '../../../components/List.svelte'
	import ListItem from '../../../components/ListItem.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { go, pushOverlay } from '../../../router'
	import { display } from '../../../services/money'
	import AccountPreview from '../.helpers/AccountPreview.svelte'

	const unallocatedExpenses = controllers.user.$unallocatedExpenses
	const pinnedEnvelopes = controllers.user.$pinnedEnvelopes

	let currentTimeInDay = timeInDay()

	function timeInDay() {
		const hours = new Date().getHours()

		if (hours < 3 || hours > 22) return 'night'
		if (hours >= 18) return 'evening'
		if (hours >= 12) return 'afternoon'

		return 'morning'
	}

	const interval = setInterval(() => (currentTimeInDay = timeInDay()), 1000 * 60)

	onDestroy(() => clearInterval(interval))

	const shortcuts = [
		{
			name: 'Trends',
			icon: 'outline::chart-square-bar',
			action: () => go('app.home.trends'),
		},
		{
			name: 'Transactions',
			icon: 'outline::cash',
			action: () => go('app.home.transactions'),
		},
		{
			name: 'Create',
			icon: 'outline::plus',
			action: () => pushOverlay('create', {}),
		},
	]
</script>

<PageView allowScroll>
	<div class="container">
		<div class="header">
			<div class="greeting">
				<Text content="Good {currentTimeInDay}!" style="title" />
			</div>

			<div class="icon" on:click={() => go('app.home.settings')}>
				<Icon name="solid::cog" size={25} />
			</div>
		</div>

		<div class="spacer" />

		<div class="spacer" />

		{#if $unallocatedExpenses.length}
			<List>
				{#each $unallocatedExpenses as transaction}
					<ListItem
						onSelect={() => pushOverlay('transaction', transaction.id)}
						title={transaction.title || 'no title'}
						discreetTitle={!transaction.title}
						description="Unallocated"
						discreetDescription={true}
						icon="solid::minus-sm"
						iconDecoration="danger"
						showArrow
						arrowText={display(transaction.amount)}
					/>
				{/each}
			</List>
		{:else}
			<div class="empty-block">
				<Text content="🎉 You're all caught up!" />
				<div class="spacer" />
				<Text content="No unallocated expenses" style="sub-body" />
			</div>
		{/if}

		<div class="spacer" />
		<div class="spacer" />

		<Text content="Shortcuts" style="header" />

		<div class="spacer" />

		<div class="shortcuts">
			{#each shortcuts as shortcut}
				<div class="shortcut" on:click={shortcut.action}>
					<Icon name={shortcut.icon} size={35} decoration="action" />

					<div class="tiny-spacer" />

					<Text content={shortcut.name} style="sub-body" primary />
				</div>
			{/each}
		</div>

		<div class="spacer" />
		<div class="spacer" />

		<Text content="Pinned Envelopes" style="header" />

		<div class="spacer" />

		{#if $pinnedEnvelopes.length}
			<List>
				{#each $pinnedEnvelopes as envelope}
					<AccountPreview account={envelope} isEnvelope={true} />
				{/each}
			</List>
		{:else}
			<div class="empty-block">
				<Text content="No Pinned Envelopes" />
				<div class="spacer" />
				<Text content="You can pin any envelope by clicking the pin icon" style="sub-body" />
			</div>
		{/if}
	</div>
</PageView>

<style>
	.header {
		display: flex;
		align-items: center;
	}

	.greeting {
		flex-grow: 1;
		opacity: 0.3;
	}

	.header .icon {
		cursor: pointer;
	}

	.empty-block {
		border-radius: 10px;
		background: var(--background2);
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.shortcuts {
		display: flex;
		justify-content: space-between;
	}
	.shortcut {
		width: 100px;
		height: 100px;
		background: var(--background1);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: opacity 100ms;
	}
	.shortcut:active {
		opacity: 0.8;
	}
	.tiny-spacer {
		height: 5px;
	}
</style>
