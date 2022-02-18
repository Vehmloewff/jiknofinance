<script lang="ts">
	import type { Envelope, Location } from '../../../api'
	import ListItem from '../../../components/ListItem.svelte'
	import { go, state } from '../../../router'
	import { display } from '../../../services/money'
	import { accountDisplayTitle } from './utils'

	export let account: Envelope | Location
	export let isEnvelope: boolean
</script>

<ListItem
	title={accountDisplayTitle(account.name)}
	showArrow
	arrowText={display(account.balance)}
	onSelect={() => go(`app.accounts.account`, { account, isEnvelope, backTo: $state })}
/>
