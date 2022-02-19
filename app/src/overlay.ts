import type { SvelteComponent } from 'svelte'
import { get, writable } from 'svelte/store'

export interface InternalOverlay {
	id: string
	component: typeof SvelteComponent
	params: any
	onDone: (result: any) => void
}

export const activeOverlays = writable<InternalOverlay[]>([])

export interface OverlayParams {
	component: typeof SvelteComponent
	params: any
	id: string
}

function runOverlay(params: OverlayParams) {
	return new Promise<any>(resolve => {
		activeOverlays.update($overlays => {
			$overlays = [...$overlays, { ...params, onDone: resolve }]
			return $overlays
		})
	})
}

function removeOverlay(id: string, result: any) {
	activeOverlays.update($overlays => {
		const newOverlays: InternalOverlay[] = []

		for (const overlay of $overlays) {
			if (overlay.id !== id) newOverlays.push(overlay)
			else overlay.onDone(result)
		}

		return newOverlays
	})
}

export interface Overlay<Params, Result> {
	component: typeof SvelteComponent
	run(params: Params): Promise<Result>
	getParams(): Params
	close(result: Result): void
}

let counter = 0

export function registerOverlay<Params, Result>(component: typeof SvelteComponent): Overlay<Params, Result> {
	const id = `overlay-id-${counter++}`

	async function run(params: Params): Promise<Result> {
		return await runOverlay({ component, params, id })
	}

	function getParams(): Params {
		const overlays = get(activeOverlays)

		for (const overlay of overlays) {
			if (overlay.id === id) return overlay.params
		}

		throw new Error('overlay is not active')
	}

	function close(result: Result) {
		removeOverlay(id, result)
	}

	return { component, run, getParams, close }
}
