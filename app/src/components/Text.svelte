<script type="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Font, FontStyle } from './types'

	export let content: string
	export let underline = false
	export let strikeThrough = false
	export let font: Font = 'sans'
	export let style: FontStyle = 'body'
	export let primary = false
	export let selectable = false

	export let nowrap = false

	export let editable = false
	export let multiline = false
	export let obscureText = false
	export let standout = false

	const dispatch = createEventDispatcher()

	type DivEvent = Event & { currentTarget: HTMLDivElement }

	function input(e: DivEvent) {
		const newValue = e.currentTarget.textContent
		if (newValue !== content) {
			content = newValue
			dispatch('changed', newValue)
		}
	}

	function blur(e: DivEvent) {
		const newValue = e.currentTarget.textContent
		if (newValue !== content) {
			content = newValue
			dispatch('done')
		}
	}

	function keydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === 'Return') {
			if (!multiline) e.preventDefault()
		}
	}

	function keyup(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === 'Return') {
			if (!multiline) dispatch('done')
		}
	}
</script>

<div
	contenteditable={editable}
	class:editable
	class:selectable
	class:obscure={obscureText}
	class:primary
	class:underline
	class:nowrap
	class:standout
	class:strikethrough={strikeThrough}
	class:stylelarge={style === 'large'}
	class:stylemedium={style === 'medium'}
	class:stylesmall={style === 'small'}
	class:styletitle={style === 'title'}
	class:stylesubtitle={style === 'subtitle'}
	class:styleheader={style === 'header'}
	class:stylesubheader={style === 'subheader'}
	class:stylelargebody={style === 'large-body'}
	class:stylebody={style === 'body'}
	class:stylesubbody={style === 'sub-body'}
	class:fontserif={font === 'serif'}
	class:fontsans={font === 'sans'}
	class:fontmono={font === 'mono'}
	on:input={input}
	on:blur={blur}
	on:keydown={keydown}
	on:keyup={keyup}
>
	{content}
</div>

<style>
	div {
		outline: none;
		user-select: none;
		min-width: 1px;
	}
	.selectable {
		user-select: all;
		-webkit-user-select: all;
		cursor: text;
	}
	.editable {
		cursor: text;
		caret-color: var(--action);
	}
	.obscure {
		-webkit-text-security: disc;
	}
	.primary {
		color: var(--action);
	}
	.underline:not(.strikethrough) {
		text-decoration: underline;
	}
	.strikethrough:not(.underline) {
		text-decoration: line-through;
	}
	.underline.strikethrough {
		text-decoration: underline line-through;
	}
	.stylelarge {
		font-size: 30px;
	}
	.stylemedium {
		font-size: 25px;
	}
	.stylesmall {
		font-size: 20px;
	}
	.styletitle {
		font-size: 24px;
		font-weight: 500;
	}
	.stylesubtitle {
		font-size: 18px;
		font-weight: 500;
	}
	.styleheader {
		font-size: 20px;
		font-weight: bold;
		opacity: 0.5;
	}
	.stylesubheader {
		font-size: 14px;
		opacity: 0.6;
		text-transform: uppercase;
	}
	.stylelargebody {
		font-size: 16px;
	}
	.stylebody {
		font-size: 14px;
	}
	.stylesubbody {
		font-size: 12px;
		opacity: 0.6;
	}
	.stylesubbody.primary {
		opacity: 1;
	}
	.fontserif {
		font-family: serif;
	}
	.fontsans {
		font-family: 'Rubik', sans-serif;
	}
	.fontmono {
		font-family: monospace;
	}

	.nowrap {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.standout {
		font-weight: bold;
	}
</style>
