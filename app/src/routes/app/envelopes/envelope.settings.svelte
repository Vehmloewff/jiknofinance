<script lang="ts">
	import type { Envelope } from '../../../api'
	import Center from '../../../components/Center.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { displayTitle } from '../helpers/envelope-utils'

	export let envelope: Envelope
</script>

<PageView backTo={{ name: 'Back', state: 'app.envelopes.envelope' }} title="{displayTitle(envelope.name)} Settings">
	<Center>
		<Text content="Still working on it!" />
	</Center>
</PageView>
