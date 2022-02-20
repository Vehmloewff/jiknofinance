import { Context, UserError } from '../deps.ts'
import { FluctuateTransaction, TransferTransaction, Envelope, Location, UserInfo } from '../db.cluster.ts'
import { getRealUser, makeTransactionId, sureGet } from '../utils.ts'

export async function getLatestTransactions(
	context: Context,
	params: { envelopeId: string | null; locationId: string | null; length: number }
): Promise<{ type: string; transaction: TransferTransaction | FluctuateTransaction }[]> {
	await getRealUser(context)

	const transferTransactions: TransferTransaction[] = []
	const fluctuateTransactions: FluctuateTransaction[] = []

	for await (const transaction of TransferTransaction.all()) {
		if (transferTransactions.length >= params.length) break

		if (isInBreakdown(params.envelopeId, [...transaction.givingAccountsBreakdown, ...transaction.receivingAccountsBreakdown]))
			transferTransactions.push(transaction)
	}

	for await (const transaction of FluctuateTransaction.all()) {
		if (fluctuateTransactions.length > params.length) break

		if (isInBreakdown(params.envelopeId, transaction.envelopeBreakdown)) fluctuateTransactions.push(transaction)
		if (isInBreakdown(params.locationId, transaction.locationBreakdown)) fluctuateTransactions.push(transaction)
	}

	const joinedTransactions: {
		type: string
		transaction: TransferTransaction | FluctuateTransaction
	}[] = [
		...transferTransactions.map(transaction => ({ type: 'expense', transaction })),
		...fluctuateTransactions.map(transaction => ({ type: 'income', transaction })),
	]

	return joinedTransactions.sort((a, b) => b.transaction.date - a.transaction.date).slice(0, params.length)
}

export async function getTransaction(context: Context, id: string): Promise<TransferTransaction | FluctuateTransaction> {
	const user = await getRealUser(context)

	const transaction = (await TransferTransaction.get(id)) || (await FluctuateTransaction.get(id))
	if (!transaction) throw new UserError(`Transaction ${id} does not exist`)

	if (transaction.userId !== user.userId) throw new UserError(`You do not own transaction ${id}`)
	return transaction
}

export async function createFluctuateTransaction(
	context: Context,
	params: {
		type: 'income' | 'expense'
		title: string | null
		date: number
		amount: number
		locationBreakdown: { amount: number; id: string }[]
		envelopeBreakdown: { amount: number; id: string }[]
	}
) {
	const user = await getRealUser(context)

	const transactionId = makeTransactionId()

	// You cannot do anything with no location specified
	if (!params.locationBreakdown.length) throw new UserError('All transactions must come from/to a location')

	// If there is no envelope specified, add it to the unallocated transactions
	if (!params.envelopeBreakdown.length) {
		const info = await sureGet(UserInfo, user.userId)
		info.unallocatedExpenseTransactions.push(transactionId)

		await UserInfo.update(info)
	}

	await FluctuateTransaction.insert({
		amount: params.amount,
		date: params.date,
		envelopeBreakdown: params.envelopeBreakdown,
		locationBreakdown: params.locationBreakdown,
		type: params.type,
		title: params.title,
		userId: user.userId,
		id: transactionId,
	})

	// Dish out/in the money for the envelopes
	for (const breakdownItem of params.envelopeBreakdown) {
		const envelope = await sureGet(Envelope, breakdownItem.id)

		if (params.type === 'income') envelope.balance += breakdownItem.amount
		else envelope.balance -= breakdownItem.amount

		await Envelope.update(envelope)
	}

	// Dish out/in the money for the locations
	for (const breakdownItem of params.locationBreakdown) {
		const location = await sureGet(Location, breakdownItem.id)

		if (params.type === 'income') location.balance += breakdownItem.amount
		else location.balance -= breakdownItem.amount

		await Location.update(location)
	}

	return transactionId
}

export async function createTransferTransaction(
	context: Context,
	params: {
		type: 'envelope' | 'location'
		title: string
		date: number
		amount: number
		givingAccountsBreakdown: { amount: number; id: string }[]
		receivingAccountsBreakdown: { amount: number; id: string }[]
	}
) {
	const user = await getRealUser(context)

	const transactionId = makeTransactionId()

	await TransferTransaction.insert({
		id: transactionId,
		type: params.type,
		title: params.title,
		userId: user.userId,
		amount: params.amount,
		date: params.date,
		givingAccountsBreakdown: params.givingAccountsBreakdown,
		receivingAccountsBreakdown: params.receivingAccountsBreakdown,
	})

	const dishFunds = async (breakdown: TransferTransaction['givingAccountsBreakdown'], mode: 'giving' | 'receiving') => {
		for (const breakdownItem of breakdown) {
			if (params.type === 'envelope') {
				const envelope = await sureGet(Envelope, breakdownItem.id)

				if (mode === 'receiving') envelope.balance += breakdownItem.amount
				else envelope.balance -= breakdownItem.amount

				await Envelope.update(envelope)
			} else {
				const location = await sureGet(Location, breakdownItem.id)

				if (mode === 'receiving') location.balance += breakdownItem.amount
				else location.balance -= breakdownItem.amount

				await Location.update(location)
			}
		}
	}

	await dishFunds(params.givingAccountsBreakdown, 'giving')
	await dishFunds(params.receivingAccountsBreakdown, 'receiving')

	return transactionId
}

function isInBreakdown(id: string | null, breakdown: { id: string }[]) {
	if (!id) return null

	for (const breakdownItem of breakdown) {
		if (breakdownItem.id === id) return true
	}

	return false
}
