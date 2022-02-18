<script lang="ts">
	import Onboard from './routes/onboard/mod.svelte'
	import NewUser from './routes/new-user.svelte'
	import Splash from './splash.svelte'
	import { isSameRoute, overlays, state } from './router'
	import { online, user } from './api'
	import App from './routes/app/mod.svelte'
	import NoState from './no-state.svelte'
	import PageView from './components/PageView.svelte'
	import Transaction from './overlays/transaction.svelte'

	$: {
		if ($user.isGuest) {
			if ($state.startsWith('app')) $state = 'new-user'
		} else if ($user.isReal) {
			if (!$state.startsWith('app')) $state = 'app.home.overview'
		} else {
			console.log('no support for admins atm')
		}
	}
</script>

<div class="app" on:contextmenu|preventDefault>
	{#if isSameRoute('onboard', $state)}
		<Onboard />
	{:else if isSameRoute('new-user', $state)}
		<NewUser />
	{:else if isSameRoute('app', $state)}
		<App />
	{:else}
		<PageView>
			<NoState />
		</PageView>
	{/if}

	{#if !$online}
		<Splash />
	{/if}
</div>

{#each $overlays as overlay}
	{#if overlay.name === 'transaction'}
		<Transaction id={overlay.params} />
	{/if}
{/each}

<style>
	.app {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--background);
	}
</style>
