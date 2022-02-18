<script lang="ts">
	import { controllers } from '../../../api'
	import Center from '../../../components/Center.svelte'
	import List from '../../../components/List.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { accountsSorter } from '../helpers/utils'
	import AccountPreview from '../helpers/AccountPreview.svelte'

	export let isEnvelope: boolean

	const accounts = isEnvelope ? controllers.envelopes.$envelopes : controllers.locations.$locations
</script>

<PageView
	title={isEnvelope ? 'Envelopes' : 'Locations'}
	trailingIcon={{ name: 'solid::plus-circle', onSelection: () => console.log('TODO') }}
	allowScroll
>
	{#if accounts}
		<div class="container">
			<List>
				{#each accountsSorter($accounts) as account}
					<AccountPreview {account} {isEnvelope} />
				{/each}
			</List>
		</div>
	{:else}
		<Center>
			<div class="align-text container">
				<Text content="No Envelopes" />
			</div>
		</Center>
	{/if}
</PageView>
