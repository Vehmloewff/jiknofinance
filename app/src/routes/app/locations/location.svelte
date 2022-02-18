<script lang="ts">
	import type { Location } from '../../../api'
	import List from '../../../components/List.svelte'
	import ListItem from '../../../components/ListItem.svelte'
	import Loader from '../../../components/Loader.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { go, isSameRoute, pushOverlay, state } from '../../../router'
	import { safeAreaTop } from '../../../safe-area'
	import { display } from '../../../services/money'
	import { getDecoration, getIcon, getLatestTransactions } from '../../../services/transactions'
	import { displayTitle } from '../helpers/envelope-utils'
	import { makeBackground, makeCoverBackground } from '../helpers/style'
	import EnvelopeSettings from './location.settings.svelte'

	export let location: Location
</script>

{#if isSameRoute('app.locations.location.settings', $state)}
	<EnvelopeSettings {location} />
{:else}
	<PageView
		title={displayTitle(location.name)}
		backTo={{ name: 'Locations', state: 'app.locations.overview' }}
		showTitleAfter={55}
		discardTopSpace
		allowScroll
		trailingIcon={{ name: 'solid::dots-circle-horizontal', onSelection: () => go('app.locations.location.settings') }}
	>
		<div style="height: {$safeAreaTop}px; background: {makeCoverBackground(location.color)}" />

		<div class="splash" style="background: {makeBackground(location.color)}">
			<Text content={displayTitle(location.name)} style="header" />
			<div class="spacer" />
			<Text content="${location.balance}" style="large" />
		</div>

		{#await getLatestTransactions(location.id, location.balance, false)}
			<div class="placeholder-container">
				<Loader />
				<Text content="Loading latest transactions" style="sub-body" />
			</div>
		{:then transactions}
			{#if transactions.length}
				<div class="container">
					<List>
						{#each transactions as transaction}
							<ListItem
								title={transaction.title || 'no title'}
								discreetTitle={!transaction.title}
								onSelect={() => pushOverlay('transaction', transaction.id)}
								showArrow
								arrowText="-{display(transaction.amount)}"
								icon={getIcon(transaction.type)}
								iconDecoration={getDecoration(transaction.type)}
								description="Balance: {display(transaction.currentBalance)}"
								discreetDescription
							/>
						{/each}
					</List>
				</div>
			{:else}
				<div class="placeholder-container">
					<Text content="No transactions that appy to this envelope" style="sub-body" />
				</div>
			{/if}
		{/await}
	</PageView>
{/if}

<style>
	.splash {
		height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.placeholder-container {
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
</style>
