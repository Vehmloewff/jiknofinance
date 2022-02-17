<script lang="ts">
	import Icon from '../../components/Icon.svelte'
	import Scaffold from '../../components/Scaffold.svelte'
	import ScrollView from '../../components/ScrollView.svelte'
	import Text from '../../components/Text.svelte'
	import NoState from '../../no-state.svelte'
	import { go, isSameRoute, state } from '../../router'
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
			rootState: 'app.envelopes',
			state: 'app.envelopes.overview',
			icon: 'solid::mail',
		},
		{
			name: 'Locations',
			rootState: 'app.locations',
			state: 'app.locations.overview',
			icon: 'solid::credit-card',
		},
		{
			name: 'Create',
			rootState: 'app.create',
			state: 'app.create.expense',
			icon: 'solid::plus-circle',
		},
	]
</script>

<Scaffold>
	<ScrollView>
		{#if isSameRoute('app.home', $state)}
			<Home />
		{:else}
			<NoState />
		{/if}

		<div class="tab-bar-space" />
	</ScrollView>

	<div class="tab-bar">
		{#each pages as page}
			<div
				class="tab-button"
				class:clickable={!isSameRoute(page.rootState, $state)}
				class:active={isSameRoute(page.rootState, $state)}
				on:click={() => {
					if (!isSameRoute(page.rootState, $state)) go(page.state)
				}}
			>
				<Icon name={page.icon} size={25} />
				<Text content={page.name} style="sub-body" primary={isSameRoute(page.rootState, $state)} />
			</div>
		{/each}
	</div>
</Scaffold>

<style>
	.tab-bar-space {
		height: 92px;
	}

	.tab-bar {
		position: absolute;
		right: 16px;
		left: 16px;
		bottom: 16px;
		height: 60px;
		background: rgba(255, 255, 255, 0.205);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px); /* support ios */
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
