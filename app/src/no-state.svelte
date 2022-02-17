<script lang="ts">
	import Center from './components/Center.svelte'
	import Text from './components/Text.svelte'
	import { state } from './router'
</script>

<Center>
	<div class="no-state">
		<Text content="Looks like you found a broken link" style="title" />

		<div class="spacer" />

		<Text content="'{$state}' is not a valid application state" style="sub-body" selectable />
	</div>
</Center>

<style>
	.no-state {
		text-align: center;
		margin: 16px;
	}
</style>
