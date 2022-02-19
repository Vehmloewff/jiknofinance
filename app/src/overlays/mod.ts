import { registerOverlay } from '../overlay'
import Transaction from './transaction.svelte'
import Create from './create.svelte'
import AccountChoice from './account-choice.svelte'

export interface TransactionOverlayParams {
	id: string
}

export const transactionOverlay = registerOverlay<TransactionOverlayParams, null>(Transaction)

export const createOverlay = registerOverlay<null, null>(Create)

export interface AccountChoiceOverlayParams {
	isEnvelope: boolean
	overrideWithIncomeType: boolean
}

export interface AccountChoiceOverlayResult {
	id: string
	name: string
}

export const accountChoiceOverlay = registerOverlay<AccountChoiceOverlayParams, AccountChoiceOverlayResult | null>(AccountChoice)
