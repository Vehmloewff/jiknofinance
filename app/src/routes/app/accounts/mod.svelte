<script lang="ts">
	import NoState from '../../../no-state.svelte'
	import { isSameRoute, params, state } from '../../../router'
	import Account from './account.mod.svelte'
	import Overview from './overview.svelte'
</script>

{#if isSameRoute('app.accounts.overview', $state)}
	<!-- we split these up so that the PageView transition will fire when $params.isEnvelope is changed -->
	{#if $params.isEnvelope}
		<Overview isEnvelope={true} />
	{:else}
		<Overview isEnvelope={false} />
	{/if}
{:else if isSameRoute('app.accounts.account', $state)}
	<Account />
{:else}
	<NoState />
{/if}
