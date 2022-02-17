<script lang="ts">
	import type { Envelope } from '../../../api'
	import ListItem from '../../../components/ListItem.svelte'
	import { go } from '../../../router'

	export let envelope: Envelope
</script>

<ListItem
	title={envelope.name}
	showArrow
	arrowText="${envelope.balance}"
	onSelect={() => go('app.envelopes.envelope', { id: envelope.id })}
/>
