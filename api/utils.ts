import { Context, RealUser, Model, UserError } from './deps.ts'

export function makeAppLink(clientId: string, state: string, params: Record<string, string>) {
	const linkTool = clientIsMobileApp(clientId) ? 'app' : 'web'

	return `https://finance.jikno.com/link/${linkTool}/${makeLinkPath(state, params)}`
}

export function makeLinkPath(state: string, params: Record<string, string>) {
	const query = new URLSearchParams(params)

	return `${state.replaceAll('.', '/')}?${query}`
}

export function clientIsMobileApp(clientId: string) {
	if (clientId.startsWith('mobile-app-ios-')) return true

	return false
}

export function makeEnvelopeId() {
	return `Envelope-${crypto.randomUUID().replaceAll('-', '')}`
}

export function makeUserId() {
	return `JiknoFinanceUser-${crypto.randomUUID().replaceAll('-', '')}`
}

export function makeLocationId() {
	return `Location-${crypto.randomUUID().replaceAll('-', '')}`
}

export function makeTransactionId() {
	return `Transaction-${crypto.randomUUID().replaceAll('-', '')}`
}

export function makeIncomeTypeId() {
	return `IncomeType-${crypto.randomUUID().replaceAll('-', '')}`
}

export async function getRealUser(context: Context): Promise<RealUser> {
	const user = await context.getUser()
	if (!user.isReal) throw new UserError('Only authenticated users are authorized to use this method')

	return user
}

export async function sureGet<T>(model: Model<T>, id: string): Promise<T> {
	const doc = await model.get(id)
	if (!doc) throw new Error(`Expected id ${id} to exist`)

	return doc
}
