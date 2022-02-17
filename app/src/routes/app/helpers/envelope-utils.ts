import type { Envelope } from '../../../api'

export function envelopeSorter(envelopes: Envelope[]): Envelope[] {
	return envelopes.sort((a, b) => {
		if (a.name === '_builtin.tithe') return 1

		return 0
	})
}

export function displayTitle(name: string) {
	if (name === '_builtin.tithe') return 'Tithe'
	return name
}
