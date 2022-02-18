<script lang="ts">
	import type { Location } from '../../../api'
	import ListItem from '../../../components/ListItem.svelte'
	import { go } from '../../../router'
	import { display } from '../../../services/money'
	import { displayTitle } from './envelope-utils'

	export let location: Location
</script>

<ListItem
	title={displayTitle(location.name)}
	showArrow
	arrowText={display(location.balance)}
	onSelect={() => go('app.locations.location', { location })}
/>
