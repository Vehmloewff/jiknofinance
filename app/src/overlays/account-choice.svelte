<script lang="ts">
	import { controllers } from '../api'
	import List from '../components/List.svelte'

	import Overlay from '../components/Overlay.svelte'
	import AccountPreview from '../routes/app/.helpers/AccountPreview.svelte'
	import { accountChoiceOverlay } from './mod'

	const { isEnvelope, overrideWithIncomeType } = accountChoiceOverlay.getParams()

	const label = isEnvelope ? (overrideWithIncomeType ? 'Choose Income Type' : 'Choose Envelope') : 'Choose Location'
	const accounts = isEnvelope ? controllers.envelopes.$envelopes : controllers.locations.$locations

	const incomeTypes = controllers.user.$incomeTypes
</script>

<Overlay title={label} onBackButtonPressed={() => accountChoiceOverlay.close(null)} allowScroll>
	<div class="container">
		<List>
			{#if overrideWithIncomeType}
				{#each $incomeTypes as incomeType}
					{incomeType.name}
				{/each}
			{:else}
				{#each $accounts as account}
					<AccountPreview
						{account}
						{isEnvelope}
						onSelect={() => accountChoiceOverlay.close({ id: account.id, name: account.name })}
					/>
				{/each}
			{/if}
		</List>
	</div>
</Overlay>
