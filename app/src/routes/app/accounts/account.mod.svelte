<script lang="ts">
	import Account from './account.svelte'
	import AccountSettings from './account.settings.svelte'
	import { isSameRoute, params, state } from '../../../router'
</script>

{#if isSameRoute('app.accounts.account.settings', $state)}
	<AccountSettings account={$params.account} isEnvelope={$params.isEnvelope} />
{:else}
	<Account account={$params.account} isEnvelope={$params.isEnvelope} />
{/if}
