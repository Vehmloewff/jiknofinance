<script lang="ts">
	import NoState from '../../../no-state.svelte'
	import { isSameRoute, params, state } from '../../../router'
	import Envelope from './envelope.svelte'
	import Overview from './overview.svelte'
</script>

{#if isSameRoute('app.envelopes.overview', $state)}
	<Overview />
{:else if isSameRoute('app.envelopes.envelope', $state)}
	<Envelope envelope={$params.envelope} />
{:else}
	<NoState />
{/if}
