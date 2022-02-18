<script lang="ts">
	import { fade } from 'svelte/transition'
	import { go, isSameRoute, state } from '../router'
	import { safeAreaBottom, safeAreaTop } from '../safe-area'
	import { glassBackground } from '../services/glass-background'
	import Icon from './Icon.svelte'
	import Text from './Text.svelte'
	import type { Decoration } from './types'

	export let title: string | null = null
	export let trailingIcon: { decoration?: Decoration; onSelection: () => void; name: string } | null = null
	export let backTo: { state: string; name: string } | null = null
	export let allowScroll = false
	export let showTitleAfter = -1
	export let discardTopSpace = false
	export let center = false

	$: {
		if (center && allowScroll) throw new Error('the center prop does not work when items are allowed to scroll')
	}

	let showHeader = false
	let showTitle = showTitleAfter === -1

	function scroll(e: Event & { currentTarget: HTMLDivElement }) {
		const el = e.currentTarget

		if (el.scrollTop > 0) showHeader = true
		else showHeader = false

		if (el.scrollTop > showTitleAfter) showTitle = true
		else showTitle = false
	}
</script>

<div class="page-view" in:fade>
	<div class="page" class:scroller={allowScroll} on:scroll={scroll}>
		{#if !discardTopSpace}
			<div style="height: {$safeAreaTop}px" />
		{/if}

		{#if title && !discardTopSpace}
			<div class="header-space" />
		{/if}

		<div class="content" class:center>
			<slot />
		</div>

		{#if isSameRoute('app', $state)}
			<div class="tab-bar-space" />
		{/if}

		<div style="height: {$safeAreaBottom}px" />
	</div>

	{#if title}
		<div
			class="header container"
			use:glassBackground={{ display: showHeader, showBottomLine: true }}
			style="padding-top: {$safeAreaTop}px"
		>
			{#if backTo}
				<div class="back-to clickable" on:click={() => go(backTo.state)} style="top: {$safeAreaTop + 16}px">
					<Icon name="outlined::chevron-left" decoration="action" />
					<Text content={backTo.name} primary />
				</div>
			{/if}

			<div class="title align-center">
				{#if showTitle}
					<Text content={title} style="large-body" />
				{/if}
			</div>

			{#if trailingIcon}
				<div class="icon clickable" on:click={() => trailingIcon.onSelection()} style="top: {$safeAreaTop + 16}px">
					<Icon name={trailingIcon.name} size={25} decoration={trailingIcon.decoration || 'action'} />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.page-view {
		position: relative;
		height: 100%;
	}

	.page {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.scroller {
		overflow-y: auto;
	}
	.content {
		flex-grow: 1;
	}
	.content.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.header-space {
		height: 55px;
	}

	.tab-bar-space {
		height: 92px;
	}

	.header {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		text-align: center;
		height: 55px;
		padding: 0 16px;
	}

	.back-to {
		position: absolute;
		left: 16px;
		display: flex;
		align-items: center;
	}
	.title {
		line-height: 55px;
	}
	.icon {
		position: absolute;
		right: 16px;
	}
</style>
