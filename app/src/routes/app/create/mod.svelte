<script lang="ts">
	import PageView from '../../../components/PageView.svelte'
	import NoState from '../../../no-state.svelte'
	import { isSameRoute, state } from '../../../router'
	import Expense from './expense.svelte'
	import Income from './income.svelte'
</script>

{#if isSameRoute('app.create.expense', $state)}
	<Expense />
{:else if isSameRoute('app.create.income', $state)}
	<Income />
{:else}
	<PageView>
		<NoState />
	</PageView>
{/if}
