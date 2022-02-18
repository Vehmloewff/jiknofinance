import { IncomeType, UserInfo, FluctuateTransaction, Envelope, Location } from '../db.cluster.ts'
import { Context, Connection, pluralConnection, PluralConnection, singularConnection, SingularConnection, UserError } from '../deps.ts'
import { sureGet, getRealUser, makeIncomeTypeId } from '../utils.ts'

export function $user(connection: Connection): SingularConnection<UserInfo> {
	return singularConnection({
		connection,
		model: UserInfo,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return null

			return await sureGet(UserInfo, user.userId)
		},
	})
}

export function $incomeTypes(connection: Connection): PluralConnection<IncomeType> {
	return pluralConnection({
		connection,
		model: IncomeType,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return []

			const { incomeTypeIds } = await sureGet(UserInfo, user.userId)

			return await Promise.all(incomeTypeIds.map(incomeTypeId => sureGet(IncomeType, incomeTypeId)))
		},
	})
}

export function $unallocatedExpenses(connection: Connection): PluralConnection<FluctuateTransaction> {
	return pluralConnection({
		connection,
		model: FluctuateTransaction,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return []

			const { unallocatedExpenseTransactions } = await sureGet(UserInfo, user.userId)

			return await Promise.all(unallocatedExpenseTransactions.map(transactionId => sureGet(FluctuateTransaction, transactionId)))
		},
	})
}

export function $pinnedEnvelopes(connection: Connection): PluralConnection<Envelope> {
	return pluralConnection({
		connection,
		model: Envelope,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return []

			const { pinnedEnvelopeIds } = await sureGet(UserInfo, user.userId)

			return await Promise.all(pinnedEnvelopeIds.map(envelopeId => sureGet(Envelope, envelopeId)))
		},
	})
}

export async function createIncomeType(context: Context, name: string) {
	const user = await getRealUser(context)

	const userInfo = await sureGet(UserInfo, user.userId)
	const id = makeIncomeTypeId()

	await IncomeType.insert({
		id,
		userId: user.userId,
		defaultDepositLocationId: null,
		envelopeRatios: [],
		isDefault: userInfo.incomeTypeIds.length === 0,
		name,
	})

	userInfo.incomeTypeIds.push(id)
	await UserInfo.update(userInfo)

	return id
}

export async function editIncomeType(
	context: Context,
	params: {
		id: string
		name: string
		defaultDepositLocationId: string
		envelopeRatios: {
			envelopeId: string
			ratio: number | null
			takeout: number | null
		}[]
	}
) {
	const user = await getRealUser(context)

	await ensureUserOwnsInputType(user.userId, params.id)

	const incomeType = await IncomeType.get(params.id)
	if (!incomeType) throw new UserError(`Income type ${params.id} does not exist`)

	incomeType.defaultDepositLocationId = params.defaultDepositLocationId
	incomeType.envelopeRatios = params.envelopeRatios
	incomeType.name = params.name

	await IncomeType.update(incomeType)
}

export async function removeIncomeType(context: Context, id: string) {
	const user = await getRealUser(context)

	const info = await sureGet(UserInfo, user.userId)
	await ensureUserOwnsInputType(info, id)

	await IncomeType.remove(id)
}

export async function setDefaultInputType(context: Context, defaultId: string) {
	const user = await getRealUser(context)

	const info = await sureGet(UserInfo, user.userId)
	await ensureUserOwnsInputType(info, defaultId)

	for (const incomeTypeId of info.incomeTypeIds) {
		const incomeType = await sureGet(IncomeType, incomeTypeId)

		if (incomeTypeId === defaultId) {
			if (!incomeType.isDefault) {
				incomeType.isDefault = true
				await IncomeType.update(incomeType)
			}
		} else {
			if (incomeType.isDefault) {
				incomeType.isDefault = false
				await IncomeType.update(incomeType)
			}
		}
	}
}

export async function getDefaultInputType(context: Context): Promise<string | null> {
	const user = await getRealUser(context)

	const info = await sureGet(UserInfo, user.userId)

	for (const incomeTypeId of info.incomeTypeIds) {
		const incomeType = await sureGet(IncomeType, incomeTypeId)

		if (incomeType.isDefault) return incomeTypeId
	}

	return null
}

export async function getAccountName(context: Context, id: string): Promise<string> {
	await getRealUser(context)

	const account = (await Envelope.get(id)) || (await Location.get(id))

	if (!account) throw new UserError('Account was not found')

	return account.name
}

async function ensureUserOwnsInputType(info: string | UserInfo, inputTypeId: string) {
	if (typeof info === 'string') info = await sureGet(UserInfo, info)

	if (info.incomeTypeIds.indexOf(inputTypeId) === -1) throw new UserError(`You do know own the inputType ${inputTypeId}`)
}
