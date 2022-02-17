<script>
	import NoState from '../../../no-state.svelte'
	import { isSameRoute, state } from '../../../router'
	import Overview from './overview.svelte'
</script>

{#if isSameRoute('app.home.overview', $state)}
	<Overview />
{:else}
	<NoState />
{/if}
