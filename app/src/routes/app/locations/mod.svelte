<script lang="ts">
	import NoState from '../../../no-state.svelte'
	import { isSameRoute, params, state } from '../../../router'
	import Location from './location.svelte'
	import Overview from './overview.svelte'
</script>

{#if isSameRoute('app.locations.overview', $state)}
	<Overview />
{:else if isSameRoute('app.locations.location', $state)}
	<Location location={$params.location} />
{:else}
	<NoState />
{/if}
