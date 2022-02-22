import { Capacitor } from '@capacitor/core'
import { writable } from 'svelte/store'

export const safeAreaTop = writable(0)
export const safeAreaBottom = writable(0)

function setSafeArea() {
	if (!Capacitor.isNativePlatform()) return

	;(window as any).plugins.safearea.get(
		(result: any) => {
			safeAreaTop.set(result.top)
			safeAreaBottom.set(result.bottom)
		},
		(error: any) => {
			// maybe set some sensible fallbacks?
			console.log('Failed to set safe area:', error)
		}
	)
}

setSafeArea()

setInterval(setSafeArea, 10000)
