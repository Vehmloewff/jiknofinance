<script lang="ts">
	import { controllers } from '../../../api'
	import Center from '../../../components/Center.svelte'
	import List from '../../../components/List.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import Location from '../helpers/Location.svelte'

	const locations = controllers.locations.$locations
</script>

<PageView title="Locations" trailingIcon={{ name: 'solid::plus-circle', onSelection: () => console.log('TODO') }} allowScroll>
	{#if $locations.length}
		<div class="container">
			<List>
				{#each $locations as location}
					<Location {location} />
				{/each}
			</List>
		</div>
	{:else}
		<Center>
			<div class="align-text container">
				<Text content="No Locations" />
			</div>
		</Center>
	{/if}
</PageView>
