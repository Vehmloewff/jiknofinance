import { Envelope, UserInfo } from './db.cluster.ts'
import { makeEnvelopeId } from './utils.ts'

export async function seed() {
	if (await UserInfo.has('demo')) return

	const titheEnvelope: Envelope = {
		id: makeEnvelopeId(),
		balance: 0,
		name: '_builtin.tithe',
		icon: null,
		color: null,
	}

	const info: UserInfo = {
		id: 'demo',
		email: 'demo',
		envelopeIds: [titheEnvelope.id],
		incomeTypeIds: [],
		locationIds: [],
		pinnedEnvelopeIds: [],
		unallocatedExpenseTransactions: [],
	}

	await Envelope.insert(titheEnvelope)
	await UserInfo.insert(info)
}
