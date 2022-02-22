<script>
	import PageView from '../../../components/PageView.svelte'
	import NoState from '../../../no-state.svelte'
	import Overview from './overview.svelte'
	import Settings from './settings.svelte'
	import { isSameRoute, state } from '../../../router'
	import Trends from './trends.svelte'
	import Transactions from './transactions.svelte'
</script>

{#if isSameRoute('app.home.overview', $state)}
	<Overview />
{:else if isSameRoute('app.home.settings', $state)}
	<Settings />
{:else if isSameRoute('app.home.trends', $state)}
	<Trends />
{:else if isSameRoute('app.home.transactions', $state)}
	<Transactions />
{:else}
	<PageView>
		<NoState />
	</PageView>
{/if}
