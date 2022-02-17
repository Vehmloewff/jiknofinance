import { Envelope, UserInfo } from '../db.cluster.ts'
import { Connection, pluralConnection, PluralConnection, Context, UserError } from '../deps.ts'
import { sureGet, getRealUser, makeEnvelopeId } from '../utils.ts'

export function $envelopes(connection: Connection): PluralConnection<Envelope> {
	return pluralConnection({
		connection,
		model: Envelope,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return []

			const userInfo = await sureGet(UserInfo, user.userId)

			return await Promise.all(userInfo.envelopeIds.map(id => sureGet(Envelope, id)))
		},
	})
}

export async function createNewEnvelope(context: Context, name: string): Promise<string> {
	await getRealUser(context)

	const id = makeEnvelopeId()

	await Envelope.insert({
		id,
		balance: 0,
		color: null,
		icon: null,
		name,
	})

	return id
}

export async function editEnvelopeStyles(
	context: Context,
	params: { name: string; icon: string | null; color: string | null; id: string }
) {
	const user = await getRealUser(context)

	const envelope = await Envelope.get(params.id)
	if (!envelope) throw new UserError(`Location ${params.id} does not exist`)

	await ensureUserOwnsEnvelope(user.userId, envelope.id)

	envelope.name = params.name
	envelope.icon = params.icon
	envelope.color = params.color

	await Envelope.update(envelope)
}

export async function removeEnvelope(context: Context, id: string) {
	const user = await getRealUser(context)

	await ensureUserOwnsEnvelope(user.userId, id)

	await Envelope.remove(id)
}

async function ensureUserOwnsEnvelope(userId: string, envelopeId: string) {
	const userInfo = await sureGet(UserInfo, userId)

	if (userInfo.locationIds.indexOf(envelopeId) !== -1) throw new UserError(`User ${userId} does not own envelope ${envelopeId}`)
}
