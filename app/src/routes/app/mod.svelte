<script lang="ts">
	import Icon from '../../components/Icon.svelte'
	import PageView from '../../components/PageView.svelte'
	import Text from '../../components/Text.svelte'
	import NoState from '../../no-state.svelte'
	import { go, isSameRoute, params, state } from '../../router'
	import { safeAreaBottom } from '../../safe-area'
	import { glassBackground } from '../../services/glass-background'
	import Accounts from './accounts/mod.svelte'
	import Home from './home/mod.svelte'

	const pages = [
		{
			name: 'Home',
			rootState: 'app.home',
			state: 'app.home.overview',
			icon: 'solid::home',
		},
		{
			name: 'Envelopes',
			rootState: 'app.accounts',
			state: 'app.accounts.overview',
			params: { isEnvelope: true },
			icon: 'solid::mail',
		},
		{
			name: 'Locations',
			rootState: 'app.accounts',
			state: 'app.accounts.overview',
			params: { isEnvelope: false },
			icon: 'solid::credit-card',
		},
		{
			name: 'Create',
			rootState: 'app.create',
			state: 'app.create.expense',
			icon: 'solid::plus-circle',
		},
	]

	function isActive(item: typeof pages[0], state: string, params: any) {
		if (!isSameRoute(item.rootState, state)) return false

		return params.isEnvelope === item.params?.isEnvelope
	}
</script>

{#if isSameRoute('app.home', $state)}
	<Home />
{:else if isSameRoute('app.accounts', $state)}
	<Accounts />
	<!-- {:else if isSameRoute('app.locations', $state)}
	<Locations /> -->
{:else}
	<PageView>
		<NoState />
	</PageView>
{/if}

<div class="tab-bar" style="bottom: {$safeAreaBottom + 16}px" use:glassBackground={{ display: true }}>
	{#each pages as page}
		<div
			class="tab-button"
			class:clickable={!isActive(page, $state, $params)}
			class:active={isActive(page, $state, $params)}
			on:click={() => {
				if (!isActive(page, $state, $params)) go(page.state, page.params)
			}}
		>
			<Icon name={page.icon} size={25} />
			<Text content={page.name} style="sub-body" primary={isActive(page, $state, $params)} />
		</div>
	{/each}
</div>

<style>
	.tab-bar {
		position: absolute;
		right: 16px;
		left: 16px;
		height: 60px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
	}

	@media (min-width: 600px) {
		.tab-bar {
			right: calc(calc(100vw - 568px) / 2);
			left: calc(calc(100vw - 568px) / 2);
		}
	}

	.tab-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 60px;
		width: 60px;
	}
	.tab-button.clickable {
		cursor: pointer;
	}

	.tab-button.active {
		color: var(--action);
	}
</style>
