<script lang="ts">
	import * as outlineIcons from '@martinse/svelte-heroicons/dist/outline'
	import * as solidIcons from '@martinse/svelte-heroicons/dist/solid'
	import type { Decoration } from './types'

	export let name: string
	export let size = 24
	export let decoration: Decoration = 'normal'

	$: [style, trueName] = name.split('::')
	$: iconCategory = style === 'solid' ? solidIcons : outlineIcons
	$: icon = iconCategory[changeName(trueName)]

	function changeName(name: string) {
		const sections = name.trim().split('-')

		return sections
			.map((section, index) => {
				if (!index) return section

				return `${section.charAt(0).toUpperCase()}${section.slice(1)}`
			})
			.join('')
	}
</script>

{#if icon}
	<svg
		width={size}
		height={size}
		{...icon.svg}
		xmlns="http://www.w3.org/2000/svg"
		class:action={decoration === 'action'}
		class:danger={decoration === 'danger'}
		class:clear={decoration === 'clear'}
		class:warn={decoration === 'warn'}
	>
		{#each icon.paths as pathProps}
			<path {...pathProps} />
		{/each}
	</svg>
{/if}

<style>
	.action {
		--color: var(--action);
		--on-color: var(--on-action);
	}
	.danger {
		--color: var(--danger);
		--on-color: var(--on-danger);
	}
	.clear {
		--color: var(--clear);
		--on-color: var(--on-clear);
	}
	.warn {
		--color: var(--warn);
		--on-color: var(--on-warn);
	}

	svg {
		float: left;
		color: var(--color);
	}
</style>
