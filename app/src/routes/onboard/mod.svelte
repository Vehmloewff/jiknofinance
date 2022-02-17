<script lang="ts">
	import Email from './email.svelte'
	import RecieveOtp from './receive-otp.svelte'
	import Waiting from './waiting.svelte'
	import { isSameRoute, params, state } from '../../router'
	import NoState from '../../no-state.svelte'
	import PageView from '../../components/PageView.svelte'
</script>

{#if isSameRoute('onboard.email', $state)}
	<Email />
{:else if isSameRoute('onboard.waiting', $state)}
	<Waiting />
{:else if isSameRoute('onboard.receive-otp', $state)}
	<RecieveOtp otp={$params.otp} />
{:else}
	<PageView>
		<NoState />
	</PageView>
{/if}
