import { registerModel } from './deps.ts'

export interface UserInfo {
	id: string
	email: string
	locationIds: string[]
	envelopeIds: string[]
	incomeTypeIds: string[]
	pinnedEnvelopeIds: string[]
	unallocatedExpenseTransactions: string[]
}

export const UserInfo = await registerModel<UserInfo>('UserInfo')

export interface IncomeType {
	id: string
	userId: string
	name: string
	isDefault: boolean
	defaultDepositLocationId: string | null
	envelopeRatios: {
		envelopeId: string
		ratio: number | null
		takeout: number | null
	}[]
}

export const IncomeType = await registerModel<IncomeType>('IncomeType')

// export interface Notification {
// 	id: string
// 	/** If value is null, all users will be notified */
// 	notifyUserIds: string[] | null
// 	title: string
// 	type: 'info' | 'warn' | 'critical'
// 	message: string
// 	internalLink: string | null
// 	externalLink: string | null
// 	shouldEmail: boolean
// }

// export const Notification = await registerModel<Notification>('Notification')

export interface Envelope {
	id: string
	name: string
	balance: number
	icon: string | null
	color: string | null
}

export const Envelope = await registerModel<Envelope>('Envelope')

export interface Location {
	id: string
	name: string
	balance: number
	isDefaultExpenseLocation: boolean
	icon: string | null
	color: string | null
}

export const Location = await registerModel<Location>('Location')

export interface FluctuateTransaction {
	id: string
	type: 'income' | 'expense'
	userId: string
	title: string | null
	date: number
	amount: number
	locationBreakdown: { amount: number; id: string }[]
	envelopeBreakdown: { amount: number; id: string }[]
}

export const FluctuateTransaction = await registerModel<FluctuateTransaction>('FluctuateTransaction')

export interface TransferTransaction {
	id: string
	type: 'envelope' | 'location'
	userId: string
	title: string
	date: number
	amount: number
	givingAccountsBreakdown: { amount: number; id: string }[]
	receivingAccountsBreakdown: { amount: number; id: string }[]
}

export const TransferTransaction = await registerModel<TransferTransaction>('TransferTransaction')
