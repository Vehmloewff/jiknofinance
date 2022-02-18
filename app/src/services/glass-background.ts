export interface GlassBackgroundParams {
	display: boolean
	showBottomLine?: boolean
}

export function glassBackground(element: HTMLElement, params: GlassBackgroundParams) {
	element.style.setProperty('transition', 'background 100ms, border 100ms, backdrop-filter 100ms')

	function run(params: GlassBackgroundParams) {
		if (params.display) {
			element.style.setProperty('background', `var(--glass)`)
			element.style.setProperty(`backdrop-filter`, `blur(var(--glass-blur))`)
			element.style.setProperty('-webkit-backdrop-filter', 'blur(var(--glass-blur))') /* support ios */
			if (params.showBottomLine) element.style.setProperty('border-bottom', '1px solid var(--background')
		} else {
			element.style.setProperty('background', `rgba(0, 0, 0, 0)`)
			element.style.setProperty(`backdrop-filter`, `blur(0px)`)
			element.style.setProperty('-webkit-backdrop-filter', 'blur(0px)') /* support ios */
			if (params.showBottomLine) element.style.setProperty('border-bottom', '1px solid rgba(0, 0, 0, 0)')
		}
	}

	run(params)

	return {
		update: run,
	}
}
