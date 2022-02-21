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

export function dateSorter<T extends { date: number }>(transactions: T[]): T[] {
	return transactions.sort((a, b) => b.date - a.date)
}
