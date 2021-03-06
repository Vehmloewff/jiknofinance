import { writable } from 'svelte/store'

export const state = writable('new-user')
export const params = writable<any>({})

export function go(stateName: string, stateParams?: any) {
	state.set(stateName)

	params.set(stateParams || {})
}

export function isSameRoute(name: string, state: string) {
	const stateSection = state.slice(0, name.length)
	const isValid = state.slice(name.length).startsWith('.') || name.length == state.length

	return isValid && name === stateSection
}

const prefixes = ['/link/app/', '/link/web/']

for (const prefix of prefixes) {
	if (!location.pathname.startsWith(prefix)) continue

	const stateName = location.pathname.slice(prefix.length).replace(/\//g, '.')
	if (!stateName.length) continue

	const queryParams = new URLSearchParams(location.search)

	const stateParams: Record<string, string> = {}

	for (const [name, value] of queryParams.entries()) stateParams[name] = value

	state.set(stateName)
	params.set(stateParams)

	history.replaceState({}, '', '/')
}
