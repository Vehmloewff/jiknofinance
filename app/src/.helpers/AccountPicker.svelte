<script lang="ts">
	import { controllers } from '../api'

	import { accountChoiceOverlay } from '../overlays/mod'
	import PickerButton from './PickerButton.svelte'

	export let isEnvelope: boolean
	export let overrideWithIncomeType = false
	export let onPick: (id: string) => void | null = null

	let label = isEnvelope ? (overrideWithIncomeType ? 'Income Type' : 'Envelope') : 'Location'

	if (!isEnvelope) {
		controllers.locations.getDefaultExpenseLocation().then(id => {
			if (!id) return

			controllers.user.getAccountName(id).then(name => (label = name))
			if (onPick) onPick(id)
		})
	}

	function onPressed() {
		accountChoiceOverlay.run({ isEnvelope, overrideWithIncomeType }).then(res => {
			if (!res) return

			label = res.name
		})
	}
</script>

<PickerButton text={label} onPressed={onPick ? onPressed : null} />
