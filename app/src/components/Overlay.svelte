<script lang="ts">
	import { fly } from 'svelte/transition'
	import { safeAreaBottom, safeAreaTop } from '../safe-area'
	import { glassBackground } from '../services/glass-background'
	import Text from './Text.svelte'

	export let backButtonText = 'Done'
	export let onBackButtonPressed: () => void = () => {}

	export let actionButtonText: string | null = null
	export let boldActionButton = false
	export let actionButtonDisabled = false
	export let onActionButtonPressed: () => void = () => {}

	export let title: string | null = null
	export let allowScroll = false

	let windowHeight: number
	let showBackground = false

	function scroll(e: any) {
		const scrollTop = e.currentTarget.scrollTop as number

		if (scrollTop > 0) showBackground = true
		else showBackground = false
	}
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="overlay" transition:fly={{ y: windowHeight }}>
	<div class="scroller" class:scroll={allowScroll} on:scroll={scroll}>
		<div style="height: {$safeAreaTop}px" />

		<div class="header-space" />

		<div class="content">
			<slot />
		</div>

		<div style="height: {$safeAreaBottom}px" />
	</div>

	{#if title}
		<div
			class="header align-center"
			use:glassBackground={{ display: showBackground, showBottomLine: true }}
			style="padding-top: {$safeAreaTop}px"
		>
			<div class="back clickable" on:click={() => onBackButtonPressed()}>
				<Text content={backButtonText} primary />
			</div>

			<Text content={title} style="large-body" />

			{#if actionButtonText}
				<div
					class="action clickable"
					class:disabled={actionButtonDisabled}
					on:click={() => {
						if (!actionButtonDisabled) onActionButtonPressed()
					}}
				>
					<Text content={actionButtonText} primary standout={boldActionButton} />
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 2;
		background: var(--background);
	}

	.scroller {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.scroller.scroll {
		overflow-y: auto;
	}

	.header-space {
		height: 50px;
	}

	.content {
		flex-grow: 1;
		position: relative;
	}

	.header {
		line-height: 50px;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
	}

	.back {
		position: absolute;
		top: 0;
		left: 16px;
	}

	.action {
		position: absolute;
		top: 0;
		right: 16px;
	}
</style>
