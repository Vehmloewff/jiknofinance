<script lang="ts">
	import { controllers } from '../../../api'
	import Center from '../../../components/Center.svelte'
	import List from '../../../components/List.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { envelopeSorter } from '../helpers/envelope-utils'
	import Envelope from '../helpers/Envelope.svelte'

	const envelopes = controllers.envelopes.$envelopes
</script>

<PageView title="Envelopes" trailingIcon={{ name: 'solid::plus-circle', onSelection: () => console.log('TODO') }} allowScroll>
	{#if $envelopes.length}
		<div class="container">
			<List>
				{#each envelopeSorter($envelopes) as envelope}
					<Envelope {envelope} />
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
