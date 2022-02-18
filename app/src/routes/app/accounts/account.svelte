<script lang="ts">
	import type { Envelope, Location } from '../../../api'
	import List from '../../../components/List.svelte'
	import ListItem from '../../../components/ListItem.svelte'
	import Loader from '../../../components/Loader.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { go, params, pushOverlay } from '../../../router'
	import { safeAreaTop } from '../../../safe-area'
	import { display } from '../../../services/money'
	import { getDecoration, getIcon, getLatestTransactions } from '../../../services/transactions'
	import { accountDisplayTitle } from '../.helpers/utils'
	import { makeBackground, makeCoverBackground } from '../.helpers/style'

	export let account: Location | Envelope
	export let isEnvelope: boolean
</script>

<PageView
	title={accountDisplayTitle(account.name)}
	backTo={{
		name: $params.backTo === 'app.home.overview' ? 'Home' : isEnvelope ? 'Envelopes' : 'Locations',
		state: $params.backTo,
		params: { isEnvelope },
	}}
	showTitleAfter={55}
	discardTopSpace
	allowScroll
	trailingIcon={{
		name: 'solid::dots-circle-horizontal',
		onSelection: () => go('app.accounts.account.settings', { isEnvelope, account }),
	}}
>
	<div style="height: {$safeAreaTop}px; background: {makeCoverBackground(account.color)}" />

	<div class="splash" style="background: {makeBackground(account.color)}">
		<Text content={accountDisplayTitle(account.name)} style="header" />
		<div class="spacer" />
		<Text content="${account.balance}" style="large" />
	</div>

	{#await getLatestTransactions(account.id, account.balance, isEnvelope)}
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
