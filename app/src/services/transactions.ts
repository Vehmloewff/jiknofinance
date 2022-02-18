import { controllers } from '../api'
import type { Decoration } from '../components/types'

export interface SimpleTransaction {
	id: string
	type: 'transfer-in' | 'transfer-out' | 'income' | 'expense'
	amount: number
	title: string | null
	date: number
	currentBalance: number
}

export async function getLatestTransactions(id: string, endBalance: number, isEnvelope: boolean) {
	const latest = await controllers.transaction.getLatestTransactions({
		length: 30,
		envelopeId: isEnvelope ? id : null,
		locationId: !isEnvelope ? id : null,
	})

	return latest.map(({ transaction }): SimpleTransaction => {
		let amount = 0
		let type: SimpleTransaction['type']

		if (transaction.type === 'income' || transaction.type === 'expense') {
			type = transaction.type

			if (isEnvelope) {
				for (const breakdown of transaction.envelopeBreakdown) {
					if (breakdown.id === id) amount += breakdown.amount
				}
			} else {
				for (const breakdown of transaction.locationBreakdown) {
					if (breakdown.id === id) amount += breakdown.amount
				}
			}
		} else if (transaction.type === 'envelope' || transaction.type === 'location') {
			let receivingAmount = 0
			let givingAmount = 0

			for (const breakdown of transaction.givingAccountsBreakdown) {
				if (breakdown.id === id) givingAmount += breakdown.amount
			}

			for (const breakdown of transaction.receivingAccountsBreakdown) {
				if (breakdown.id === id) receivingAmount += breakdown.amount
			}

			const amountIn = givingAmount - receivingAmount

			if (amountIn < 0) {
				amount += amountIn * -1
				type = 'transfer-out'
			} else {
				amount += amountIn
				type = 'transfer-out'
			}
		}

		const currentBalance = endBalance

		endBalance += type === 'income' || type === 'transfer-in' ? -amount : amount

		return {
			amount,
			id: transaction.id,
			title: transaction.title,
			type,
			date: transaction.date,
			currentBalance,
		}
	})
}

export function getIcon(transactionType: SimpleTransaction['type']) {
	if (transactionType === 'expense') return 'solid::minus-sm'
	if (transactionType === 'income') return 'solid::plus-sm'
	if (transactionType === 'transfer-in') return 'solid::arrow-right'
	if (transactionType === 'transfer-out') return 'solid::arrow-left'
}

export function getDecoration(transactionType: SimpleTransaction['type']): Decoration {
	if (transactionType === 'transfer-out' || transactionType === 'expense') return 'danger'

	return 'clear'
}
