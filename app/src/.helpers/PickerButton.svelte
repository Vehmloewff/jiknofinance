<script lang="ts">
	import Button from '../components/Button.svelte'
	import Icon from '../components/Icon.svelte'
	import Text from '../components/Text.svelte'

	export let onPressed: (() => void) | null = null
	export let text: string
</script>

<Button {onPressed} fullWidth>
	<div class="dropdown">
		<div class="text align-center">
			<Text content={text} nowrap />
		</div>

		<Icon name="solid::chevron-down" />
	</div>
</Button>

<style>
	.dropdown {
		display: flex;
		align-items: center;
	}
	.text {
		min-width: 0;
		flex-shrink: 1;
		flex-grow: 1;
	}
</style>
