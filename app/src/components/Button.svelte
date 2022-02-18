<script type="ts">
	import type { Decoration } from './types'

	export let decoration: Decoration = 'action'
	export let primary = false
	export let onPressed: (() => void) | null = null
	export let fullWidth = false
	export let large = false
	export let submit = false
</script>

<button
	class:primary
	class:normal={decoration === 'normal'}
	class:action={decoration === 'action'}
	class:danger={decoration === 'danger'}
	class:clear={decoration === 'clear'}
	class:warn={decoration === 'warn'}
	class:large
	class:fullWidth
	type={submit ? 'submit' : 'button'}
	disabled={!onPressed}
	on:click={() => onPressed()}
>
	<slot />
</button>

<style>
	.normal {
		--color: var(--foreground);
		--on-color: var(--background);
	}
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
	button {
		padding: 5px 10px;
		border-radius: 8px;
		cursor: pointer;
		background: var(--background2);
		border: none;
		opacity: 1;
		margin: none;
		transition: opacity 100ms;
		color: var(--color);
		user-select: none;
		outline: none;
	}
	/* button:hover {
		opacity: 0.9;
	} */
	button:active {
		opacity: 0.7;
	}
	button.primary {
		background: var(--color);
		color: var(--on-color);
	}
	button:disabled {
		opacity: 0.5;
		filter: grayscale(1);
		cursor: not-allowed;
	}

	.fullWidth {
		width: 100%;
	}
	.large {
		padding: 10px 16px;
	}
</style>
