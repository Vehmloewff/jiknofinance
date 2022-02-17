import { writable } from 'svelte/store'

export const safeAreaTop = writable(0)
export const safeAreaBottom = writable(0)

function setSafeArea() {
	safeAreaTop.set(0)
	safeAreaBottom.set(0)
}

setSafeArea()

setInterval(setSafeArea, 10000)
