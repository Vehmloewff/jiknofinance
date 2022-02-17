<script lang="ts">
	import Onboard from './routes/onboard/mod.svelte'
	import NewUser from './routes/new-user.svelte'
	import Splash from './overlays/splash.svelte'
	import { isSameRoute, state } from './router'
	import { online, user } from './api'
	import App from './routes/app/mod.svelte'
	import NoState from './no-state.svelte'
	import Scaffold from './components/Scaffold.svelte'

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
		<Scaffold>
			<NoState />
		</Scaffold>
	{/if}

	{#if !$online}
		<Splash />
	{/if}
</div>

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
