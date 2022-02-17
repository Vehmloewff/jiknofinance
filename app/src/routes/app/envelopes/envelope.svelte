<script lang="ts">
	import type { Envelope } from '../../../api'
	import Loader from '../../../components/Loader.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { go, isSameRoute, state } from '../../../router'
	import { safeAreaTop } from '../../../safe-area'
	import { displayTitle } from '../helpers/envelope-utils'
	import { makeBackground, makeCoverBackground } from '../helpers/style'
	import EnvelopeSettings from './envelope.settings.svelte'

	export let envelope: Envelope
</script>

{#if isSameRoute('app.envelopes.envelope.settings', $state)}
	<EnvelopeSettings {envelope} />
{:else}
	<PageView
		title={displayTitle(envelope.name)}
		backTo={{ name: 'Envelopes', state: 'app.envelopes.overview' }}
		showTitleAfter={55}
		discardTopSpace
		allowScroll
		trailingIcon={{ name: 'solid::dots-circle-horizontal', onSelection: () => go('app.envelopes.envelope.settings') }}
	>
		<div style="height: {$safeAreaTop}px; background: {makeCoverBackground(envelope.color)}" />

		<div class="splash" style="background: {makeBackground(envelope.color)}">
			<Text content={displayTitle(envelope.name)} style="header" />
			<div class="spacer" />
			<Text content="${envelope.balance}" style="large" />
		</div>

		<div class="loader-container">
			<Loader />
			<Text content="Loading latest transactions" style="sub-body" />
		</div>
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

	.loader-container {
		height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
	}
</style>
