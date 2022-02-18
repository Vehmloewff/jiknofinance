<script lang="ts">
	import type { Envelope, Location } from '../../../api'
	import Center from '../../../components/Center.svelte'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { accountDisplayTitle } from '../.helpers/utils'

	export let account: Envelope | Location
	export let isEnvelope: boolean
</script>

<PageView
	backTo={{ name: 'Back', state: 'app.accounts.account', params: { isEnvelope } }}
	title="{accountDisplayTitle(account.name)} Settings"
>
	<Center>
		<Text content="Still working on it!" />
	</Center>
</PageView>
