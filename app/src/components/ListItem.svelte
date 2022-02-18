<script type="ts">
	import Icon from './Icon.svelte'

	import Text from './Text.svelte'
	import type { Decoration } from './types'

	export let selected = false
	export let onSelect: (() => void) | null = null

	export let icon: string | null = null
	export let iconDecoration: Decoration = 'normal'

	export let title: string
	export let description: string | null = null

	export let discreetTitle: boolean = false
	export let discreetDescription: boolean = false

	export let arrowText: string | null = null
	export let showArrow: boolean = false
</script>

<div
	class="list-item"
	class:selected
	class:selectable={!!onSelect}
	class:disabled={!onSelect}
	on:click={() => {
		if (onSelect) onSelect()
	}}
>
	{#if icon}
		<div class="little-space" />

		<Icon name={icon} decoration={iconDecoration} />
	{/if}

	<div class="little-space" />

	<div class="text">
		<div class="title" class:discreet={discreetTitle}>
			<Text content={title} style="large-body" nowrap />
		</div>

		{#if description}
			<div class="description" class:discreet={discreetDescription}>
				<Text content={description} style="sub-body" nowrap />
			</div>
		{/if}
	</div>

	{#if showArrow}
		<div class="arrow">
			<div class="little-space" />

			{#if arrowText}
				<div class="arrow-text">
					<Text content={arrowText} />
				</div>
			{/if}

			<div class="icon">
				<Icon name="outlined::chevron-right" size={20} />
			</div>
		</div>
	{:else}
		<div class="little-space" />
	{/if}
</div>

<style>
	.list-item {
		transition: background 100ms;
		display: flex;
		align-items: center;
		border-bottom: 1px solid var(--background1);
	}
	.list-item:last-child {
		border: none;
	}

	.selected {
		background: var(--action);
		color: var(--on-action);
		cursor: default;
	}
	.selectable {
		cursor: pointer;
		transition: opacity 100ms;
	}
	.selectable:active {
		opacity: 0.6;
	}
	.disabled {
		filter: grayscale(1);
		opacity: 0.5;
	}

	.little-space {
		width: 12px;
	}

	.text {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 10px 0;
		min-width: 0;
		flex-shrink: 1;
	}
	.discreet {
		opacity: 0.5;
		font-style: italic;
	}
	.description {
		padding-top: 5px;
	}

	.arrow {
		display: flex;
		align-items: center;
		opacity: 0.5;
	}
	.arrow-text {
		padding-right: 8px;
	}
	.icon {
		padding-right: 10px;
		opacity: 0.5;
	}
</style>
