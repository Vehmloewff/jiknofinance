import { Envelope, UserInfo, FluctuateTransaction, Location } from './db.cluster.ts'
import { makeEnvelopeId, makeTransactionId, makeLocationId } from './utils.ts'

export async function seed() {
	if (await UserInfo.has('demo')) return

	const userId = 'demo'

	//
	// Envelopes
	//
	const tithe: Envelope = {
		id: makeEnvelopeId(),
		balance: 405,
		name: '_builtin.tithe',
		icon: null,
		color: null,
		userId,
	}

	const groceries: Envelope = {
		id: makeEnvelopeId(),
		balance: 256,
		name: 'Groceries',
		color: null,
		icon: null,
		userId,
	}

	const bills: Envelope = {
		id: makeEnvelopeId(),
		balance: 201.56,
		name: 'Bills',
		color: null,
		icon: null,
		userId,
	}

	const familyFun: Envelope = {
		id: makeEnvelopeId(),
		balance: 134,
		name: 'Family Fun',
		color: null,
		icon: null,
		userId,
	}

	const emergencyFund: Envelope = {
		id: makeEnvelopeId(),
		balance: 1000,
		name: 'Emergency Fund',
		color: null,
		icon: null,
		userId,
	}

	const gifts: Envelope = {
		id: makeEnvelopeId(),
		balance: 67.45,
		name: 'Gifts',
		color: null,
		icon: null,
		userId,
	}

	const outToEat: Envelope = {
		id: makeEnvelopeId(),
		balance: 22.43,
		name: 'Out to Eat',
		color: null,
		icon: null,
		userId,
	}

	const savings: Envelope = {
		id: makeEnvelopeId(),
		balance: 2004.45,
		name: 'Savings',
		color: null,
		icon: null,
		userId,
	}

	const jakesSpending: Envelope = {
		id: makeEnvelopeId(),
		balance: 12.89,
		name: "Jake's Spending",
		color: null,
		icon: null,
		userId,
	}

	const sarahSpending: Envelope = {
		id: makeEnvelopeId(),
		balance: 68.45,
		name: "Sarah's Spending",
		color: null,
		icon: null,
		userId,
	}

	const homeImprovement: Envelope = {
		id: makeEnvelopeId(),
		balance: 300.6,
		name: 'Home Improvement',
		color: null,
		icon: null,
		userId,
	}

	const envelopes = [
		tithe,
		groceries,
		bills,
		familyFun,
		emergencyFund,
		gifts,
		outToEat,
		savings,
		jakesSpending,
		sarahSpending,
		homeImprovement,
	]

	let totalBalance = 0

	for (const envelope of envelopes) {
		totalBalance += envelope.balance

		await Envelope.insert(envelope)
	}

	//
	// Locations
	//

	const cashStash: Location = {
		id: makeLocationId(),
		balance: 300,
		color: null,
		icon: null,
		isDefaultExpenseLocation: false,
		name: 'Cash Stash',
		userId,
	}

	const wallet: Location = {
		id: makeLocationId(),
		balance: 23,
		color: null,
		icon: null,
		isDefaultExpenseLocation: false,
		name: 'Wallet',
		userId,
	}

	const bankAccount: Location = {
		id: makeLocationId(),
		balance: totalBalance - (cashStash.balance + wallet.balance),
		color: null,
		icon: null,
		isDefaultExpenseLocation: true,
		name: 'Bank Account',
		userId,
	}

	const locations = [cashStash, wallet, bankAccount]

	for (const location of locations) await Location.insert(location)

	//
	// Allocated Transactions
	//

	await FluctuateTransaction.insert({
		amount: 500,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [
			{ amount: 50, id: savings.id },
			{ amount: 50, id: tithe.id },
			{ amount: 100, id: emergencyFund.id },
			{ amount: 200, id: groceries.id },
			{ amount: 200, id: bills.id },
		],
		locationBreakdown: [{ amount: 500, id: bankAccount.id }],
		title: 'Paycheck',
		type: 'income',
		userId,
	})

	await FluctuateTransaction.insert({
		amount: 2.45,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [{ amount: 2.45, id: jakesSpending.id }],
		locationBreakdown: [{ amount: 2.45, id: bankAccount.id }],
		title: 'Coffee at OnCue',
		type: 'expense',
		userId,
	})

	await FluctuateTransaction.insert({
		amount: 46.56,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [{ amount: 46.56, id: groceries.id }],
		locationBreakdown: [{ amount: 46.56, id: bankAccount.id }],
		title: 'Groceries For Dinner',
		type: 'expense',
		userId,
	})

	await FluctuateTransaction.insert({
		amount: 24.64,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [{ amount: 24.64, id: bills.id }],
		locationBreakdown: [{ amount: 24.64, id: bankAccount.id }],
		title: 'Water Bill',
		type: 'expense',
		userId,
	})

	await FluctuateTransaction.insert({
		amount: 10.45,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [{ amount: 10.45, id: jakesSpending.id }],
		locationBreakdown: [{ amount: 10.45, id: bankAccount.id }],
		title: 'Roses for Sarah',
		type: 'expense',
		userId,
	})

	await FluctuateTransaction.insert({
		amount: 6.18,
		date: Date.now(),
		id: makeTransactionId(),
		envelopeBreakdown: [{ amount: 6.18, id: jakesSpending.id }],
		locationBreakdown: [{ amount: 6.18, id: bankAccount.id }],
		title: 'Protein bars for kids',
		type: 'expense',
		userId,
	})

	//
	// Unallocated Transactions
	//

	const unallocatedExpensesIds = [makeTransactionId(), makeTransactionId(), makeTransactionId()]

	await FluctuateTransaction.insert({
		amount: 30.87,
		date: Date.now(),
		id: unallocatedExpensesIds[0],
		envelopeBreakdown: [],
		locationBreakdown: [{ amount: 30.87, id: bankAccount.id }],
		title: null,
		type: 'expense',
		userId,
	})
	await FluctuateTransaction.insert({
		amount: 104.93,
		date: Date.now(),
		id: unallocatedExpensesIds[1],
		envelopeBreakdown: [],
		locationBreakdown: [{ amount: 104.93, id: bankAccount.id }],
		title: 'Groceries At Walmart',
		type: 'expense',
		userId,
	})
	await FluctuateTransaction.insert({
		amount: 30.87,
		date: Date.now(),
		id: unallocatedExpensesIds[2],
		envelopeBreakdown: [],
		locationBreakdown: [{ amount: 30.87, id: bankAccount.id }],
		title: 'Gift for Louise',
		type: 'expense',
		userId,
	})

	//
	// User
	//

	const info: UserInfo = {
		id: 'demo',
		email: 'demo',
		envelopeIds: envelopes.map(envelope => envelope.id),
		incomeTypeIds: [],
		locationIds: locations.map(location => location.id),
		pinnedEnvelopeIds: [groceries.id, jakesSpending.id, sarahSpending.id],
		unallocatedExpenseTransactions: unallocatedExpensesIds,
	}

	await UserInfo.insert(info)
}
