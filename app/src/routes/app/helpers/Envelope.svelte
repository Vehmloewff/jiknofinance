<script lang="ts">
	import type { Envelope } from '../../../api'
	import ListItem from '../../../components/ListItem.svelte'
	import { go } from '../../../router'
	import { display } from '../../../services/money'
	import { displayTitle } from './envelope-utils'

	export let envelope: Envelope
</script>

<ListItem
	title={displayTitle(envelope.name)}
	showArrow
	arrowText={display(envelope.balance)}
	onSelect={() => go('app.envelopes.envelope', { envelope })}
/>
