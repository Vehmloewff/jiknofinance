import type { Envelope } from '../../../api'

export function accountDisplayTitle(name: string) {
	if (name === '_builtin.tithe') return 'Tithe'
	return name
}

export function accountsSorter(envelopes: Envelope[]): Envelope[] {
	return envelopes.sort((a, b) => {
		if (a.name === '_builtin.tithe') return 1

		return 0
	})
}
