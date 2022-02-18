// deno-lint-ignore-file
// This is a generated file.  Do not edit.

export function uuid() {
	let d = Date.now()
	return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, c => {
		const r = (d + Math.random() * 16) % 16 | 0
		d = Math.floor(d / 16)
		return (c == `x` ? r : (r & 0x3) | 0x8).toString(16)
	})
}

export function generateClientId(prefix = 'client-id-') {
	return `${prefix}${uuid()}`
}

export interface Storable<T> {
	get(): T
	set(v: T): void
	subscribe(listener: Subscriber<T>): () => void
	getNumberOfSubscribers(): number
}

export type Subscriber<T> = (newVal: T, initialCall: boolean) => void

function makeStorable<T>(value: T): Storable<T> {
	const subscribers: Subscriber<T>[] = []

	function get(): T {
		return value
	}

	function set(newVal: T) {
		value = newVal

		subscribers.forEach(listener => listener(value, false))
	}

	function subscribe(listener: Subscriber<T>) {
		listener(value, true)

		subscribers.push(listener)

		return () => {
			const index = subscribers.indexOf(listener)
			if (index === -1) return // already unsubscribed

			subscribers.splice(index, 1)
		}
	}

	function getNumberOfSubscribers() {
		return subscribers.length
	}

	return {
		get,
		set,
		subscribe,
		getNumberOfSubscribers,
	}
}

const preOpenedMethods: string[] = []

const defaultOnSubscriptionHandler = (methodPath: string, subscriptionCount: number) => {
	const methodPathIndex = preOpenedMethods.indexOf(methodPath)
	const exists = methodPathIndex !== -1

	if (subscriptionCount > 0 && !exists) preOpenedMethods.push(methodPath)
	else if (subscriptionCount === 0 && exists) preOpenedMethods.splice(methodPathIndex, 1)
}

let onSubscription: (methodPath: string, subscriptionCount: number) => void = defaultOnSubscriptionHandler

export interface ReadableStore<T> {
	get(): T
	subscribe(listener: Subscriber<T>): () => void
}

interface CustomStorable<T> {
	readable: ReadableStore<T>
	set: Storable<T>['set']
	getNumberOfSubscribers: Storable<T>['getNumberOfSubscribers']
	isArray: boolean
}

function makeCustomStorable<T>(methodPath: string, value: T): CustomStorable<T> {
	const { get, getNumberOfSubscribers, set, subscribe } = makeStorable(value)

	return {
		readable: {
			get,
			subscribe(fn) {
				const unsubscribe = subscribe(fn)
				onSubscription(methodPath, getNumberOfSubscribers())

				return () => {
					unsubscribe()
					onSubscription(methodPath, getNumberOfSubscribers())
				}
			},
		},
		set,
		getNumberOfSubscribers,
		isArray: Array.isArray(value),
	}
}

let apiUrl: string | null = null
let wsUrl: string | null = null
let clientId: string | null = null

export type User = RealUser | GuestUser | AdminUser

export interface RealUser {
	isReal: true
	isGuest: false
	isAdmin: false
	userId: string
	clientId: string
}

export interface GuestUser {
	isReal: false
	isGuest: true
	isAdmin: false
	clientId: string
}

export interface AdminUser {
	isReal: false
	isGuest: false
	isAdmin: true
	clientId: string
}

export const user = makeStorable<User>({
	clientId: 'not-yet-allocated',
	isAdmin: false,
	isGuest: true,
	isReal: false,
})

export const online = makeStorable(false)

const heartbeatNumber = makeStorable(0)

export function injectHeartbeat() {
	heartbeatNumber.set(heartbeatNumber.get() + 1)
}

// Create a heartbeat every 10 seconds
setInterval(injectHeartbeat, 10 * 1000)

/** Bare connect takes in the stores to be synced as an object { 'controllerName/methodName': storable } */
function bareConnect(storables: Record<string, CustomStorable<any>>) {
	return new Promise<void>(resolve => {
		if (!clientId || !wsUrl) throw new Error('invalid params passed to connect')

		const unsubscribers: (() => void)[] = []
		const methodIsObserving: Record<string, boolean> = {}

		const url = `${wsUrl}/connection`
		console.log(`[socket] connecting to ${url}...`)

		let didConnect = false
		const websocket = new WebSocket(`${url}?clientId=${clientId}`)

		websocket.onclose = () => {
			onSubscription = defaultOnSubscriptionHandler

			unsubscribers.forEach(fn => fn())
			online.set(false)

			console.log('[socket] disconnected, waiting for three seconds before reconnecting...')
			setTimeout(() => {
				bareConnect(storables).then(() => {
					if (!didConnect) resolve()
				})
			}, 3000)
		}

		websocket.onopen = () => {
			console.log('[socket] connected')
			online.set(true)

			didConnect = true
			resolve()

			for (const methodPath in storables) methodIsObserving[methodPath] = preOpenedMethods.indexOf(methodPath) !== -1

			for (const methodPath in methodIsObserving) {
				const observing = methodIsObserving[methodPath]

				if (observing) websocket.send(JSON.stringify({ $: 'add-observation', methodPath }))
			}

			onSubscription = (methodPath, numberOfSubscribers) => {
				const isObserving = methodIsObserving[methodPath]
				const shouldObserve = numberOfSubscribers > 0

				if (isObserving && shouldObserve) return
				if (!isObserving && !shouldObserve) return

				if (isObserving && !shouldObserve) {
					// set the observation to it's default value (null or [], depending on the tense) when subscribers are removed to conserve memory
					storables[methodPath].set(storables[methodPath].isArray ? [] : null)

					methodIsObserving[methodPath] = false
					return websocket.send(JSON.stringify({ $: 'remove-observation', methodPath }))
				}

				if (!isObserving && shouldObserve) {
					methodIsObserving[methodPath] = true
					return websocket.send(JSON.stringify({ $: 'add-observation', methodPath }))
				}
			}

			unsubscribers.push(
				heartbeatNumber.subscribe(() => {
					websocket.send(JSON.stringify({ $: 'heartbeat' }))
				})
			)
		}

		websocket.onmessage = ({ data }) => {
			const message = JSON.parse(data)

			// if .set(document) was called on the model
			if (message.$ === 'item-set') {
				const methodPath = message.methodPath as string
				const storable = storables[methodPath]

				storable.set(message.data)
			}
			// if .insert(document) was called on the model
			else if (message.$ === 'item-insert') {
				const methodPath = message.methodPath as string
				const storable = storables[methodPath]

				const currentValue = storable.readable.get() as any[]
				if (!Array.isArray(currentValue)) throw new Error('cannot perform an insert on a value that is not an array')

				currentValue.push(message.data)
				storable.set(currentValue)
			}
			// if .update(document) was called on the model
			else if (message.$ === 'item-update') {
				const methodPath = message.methodPath as string
				const storable = storables[methodPath]

				const currentValue = storable.readable.get() as any[]
				if (!Array.isArray(currentValue)) throw new Error('cannot perform an insert on a value that is not an array')

				const indexOfItemToUpdate = currentValue.findIndex(item => item[message.index] === message.id)
				if (indexOfItemToUpdate === -1) throw new Error('cannot find item that was supposed to be updated')

				currentValue[indexOfItemToUpdate] = message.data

				storable.set(currentValue)
			}
			// if .remove(documentId) was called on the model
			else if (message.$ === 'item-remove') {
				const methodPath = message.methodPath as string
				const storable = storables[methodPath]

				const currentValue = storable.readable.get() as any[]
				if (!Array.isArray(currentValue)) throw new Error('cannot perform an insert on a value that is not an array')

				const indexOfItemToRemove = currentValue.findIndex(item => item[message.index] === message.id)
				if (indexOfItemToRemove === -1) throw new Error('cannot find item that was supposed to be updated')

				currentValue.splice(indexOfItemToRemove, 1)

				storable.set(currentValue)
			} else if (message.$ === 'auth-change') {
				if (!clientId) throw new Error('unexpected outcome in generated glue code')

				if (message.changeTo === 'guest') user.set({ clientId, isAdmin: false, isGuest: true, isReal: false })
				else if (message.changeTo === 'real')
					user.set({ clientId, isAdmin: false, isGuest: false, isReal: true, userId: message.userId })
				else if (message.changeTo === 'admin') user.set({ clientId, isAdmin: true, isGuest: false, isReal: false })
			}
		}
	})
}

interface ConventionalMethodParams {
	controllerName: string
	methodName: string
	params: any
	returnType?: 'string' | 'binary' | 'json' | 'void'
}

async function conventionalMethod(params: ConventionalMethodParams) {
	if (!apiUrl || !clientId) throw new Error('connect must be called before any methods are called')

	const returnType = params.returnType || 'string'
	const headers = new Headers()

	headers.append('Client-Id', clientId)

	return await fetch(`${apiUrl}/call/${params.controllerName}/${params.methodName}`, {
		body: JSON.stringify({ params: params.params }),
		method: 'POST',
		headers,
	}).then(async res => {
		if (!res.ok) throw new Error(await res.text())

		if (returnType === 'binary') return new Uint8Array(await res.arrayBuffer())
		if (returnType === 'json') return (await res.json()).data

		// do nothing for returnType === 'void'
	})
}

const store_user_$user = makeCustomStorable<UserInfo | null>('user/$user', null)
const store_user_$incomeTypes = makeCustomStorable<IncomeType[]>('user/$incomeTypes', [])
const store_user_$unallocatedExpenses = makeCustomStorable<FluctuateTransaction[]>('user/$unallocatedExpenses', [])
const store_user_$pinnedEnvelopes = makeCustomStorable<Envelope[]>('user/$pinnedEnvelopes', [])
const store_envelopes_$envelopes = makeCustomStorable<Envelope[]>('envelopes/$envelopes', [])
const store_locations_$locations = makeCustomStorable<Location[]>('locations/$locations', [])

export interface ConnectParams {
	clientId: string
	host: string
	forceSecure?: boolean
}

export async function connect(params: ConnectParams) {
	const secure = params.forceSecure || location?.host === 'https:'

	clientId = params.clientId
	apiUrl = `${secure ? 'https' : 'http'}://${params.host}`
	wsUrl = `${secure ? 'wss' : 'ws'}://${params.host}`

	user.set({ clientId, isAdmin: false, isGuest: true, isReal: false })

	await bareConnect({
		'user/$user': store_user_$user,
		'user/$incomeTypes': store_user_$incomeTypes,
		'user/$unallocatedExpenses': store_user_$unallocatedExpenses,
		'user/$pinnedEnvelopes': store_user_$pinnedEnvelopes,
		'envelopes/$envelopes': store_envelopes_$envelopes,
		'locations/$locations': store_locations_$locations,
	})
}

export const controllers = {
	transaction: {
		async getLatestTransactions(params: {
					envelopeId: string | null
					locationId: string | null
					length: number
				}): Promise<{
					type: string
					transaction: TransferTransaction | FluctuateTransaction
				}[]> {
			return await conventionalMethod({
				controllerName: 'transaction',
				methodName: 'getLatestTransactions',
				params: params,
				returnType: 'json',
			})
		},
		async getTransaction(params: string): Promise<TransferTransaction | FluctuateTransaction> {
			return await conventionalMethod({
				controllerName: 'transaction',
				methodName: 'getTransaction',
				params: params,
				returnType: 'json',
			})
		},
		async createFluctuateTransaction(params: {
					type: 'income' | 'expense'
					title: string | null
					date: number
					amount: number
					locationBreakdown: {
						amount: number
						id: string
					}[]
					envelopeBreakdown: {
						amount: number
						id: string
					}[]
				}): Promise<void> {
			return await conventionalMethod({
				controllerName: 'transaction',
				methodName: 'createFluctuateTransaction',
				params: params,
				returnType: 'void',
			})
		},
		async createTransferTransaction(params: {
					type: 'envelope' | 'location'
					title: string
					date: number
					amount: number
					givingAccountsBreakdown: {
						amount: number
						id: string
					}[]
					receivingAccountsBreakdown: {
						amount: number
						id: string
					}[]
				}): Promise<void> {
			return await conventionalMethod({
				controllerName: 'transaction',
				methodName: 'createTransferTransaction',
				params: params,
				returnType: 'void',
			})
		},
	},
	authenticate: {
		async sendConfirmationEmail(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'authenticate',
				methodName: 'sendConfirmationEmail',
				params: params,
				returnType: 'void',
			})
		},
		async verifyOtp(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'authenticate',
				methodName: 'verifyOtp',
				params: params,
				returnType: 'void',
			})
		},
		async logout(): Promise<void> {
			return await conventionalMethod({
				controllerName: 'authenticate',
				methodName: 'logout',
				params: null,
				returnType: 'void',
			})
		},
	},
	user: {
		$user: store_user_$user.readable,
		$incomeTypes: store_user_$incomeTypes.readable,
		$unallocatedExpenses: store_user_$unallocatedExpenses.readable,
		$pinnedEnvelopes: store_user_$pinnedEnvelopes.readable,
		async createIncomeType(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'createIncomeType',
				params: params,
				returnType: 'void',
			})
		},
		async editIncomeType(params: {
					id: string
					name: string
					defaultDepositLocationId: string
					envelopeRatios: {
						envelopeId: string
						ratio: number | null
						takeout: number | null
					}[]
				}): Promise<void> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'editIncomeType',
				params: params,
				returnType: 'void',
			})
		},
		async removeIncomeType(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'removeIncomeType',
				params: params,
				returnType: 'void',
			})
		},
		async setDefaultInputType(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'setDefaultInputType',
				params: params,
				returnType: 'void',
			})
		},
		async getDefaultInputType(): Promise<string | null> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'getDefaultInputType',
				params: null,
				returnType: 'json',
			})
		},
		async getAccountName(params: string): Promise<string> {
			return await conventionalMethod({
				controllerName: 'user',
				methodName: 'getAccountName',
				params: params,
				returnType: 'json',
			})
		},
	},
	envelopes: {
		$envelopes: store_envelopes_$envelopes.readable,
		async createNewEnvelope(params: string): Promise<string> {
			return await conventionalMethod({
				controllerName: 'envelopes',
				methodName: 'createNewEnvelope',
				params: params,
				returnType: 'json',
			})
		},
		async editEnvelopeStyles(params: {
					name: string
					icon: string | null
					color: string | null
					id: string
				}): Promise<void> {
			return await conventionalMethod({
				controllerName: 'envelopes',
				methodName: 'editEnvelopeStyles',
				params: params,
				returnType: 'void',
			})
		},
		async removeEnvelope(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'envelopes',
				methodName: 'removeEnvelope',
				params: params,
				returnType: 'void',
			})
		},
	},
	locations: {
		$locations: store_locations_$locations.readable,
		async createNewLocation(params: string): Promise<string> {
			return await conventionalMethod({
				controllerName: 'locations',
				methodName: 'createNewLocation',
				params: params,
				returnType: 'json',
			})
		},
		async editLocationStyles(params: {
					name: string
					icon: string | null
					color: string | null
					id: string
				}): Promise<void> {
			return await conventionalMethod({
				controllerName: 'locations',
				methodName: 'editLocationStyles',
				params: params,
				returnType: 'void',
			})
		},
		async removeLocation(params: string): Promise<void> {
			return await conventionalMethod({
				controllerName: 'locations',
				methodName: 'removeLocation',
				params: params,
				returnType: 'void',
			})
		},
	},
}

export interface UserInfo {
	id: string
	email: string
	locationIds: string[]
	envelopeIds: string[]
	incomeTypeIds: string[]
	pinnedEnvelopeIds: string[]
	unallocatedExpenseTransactions: string[]
}

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

export interface Envelope {
	id: string
	name: string
	balance: number
	icon: string | null
	color: string | null
}

export interface Location {
	id: string
	name: string
	balance: number
	isDefaultExpenseLocation: boolean
	icon: string | null
	color: string | null
}

export interface FluctuateTransaction {
	id: string
	type: 'income' | 'expense'
	userId: string
	title: string | null
	date: number
	amount: number
	locationBreakdown: {
		amount: number
		id: string
	}[]
	envelopeBreakdown: {
		amount: number
		id: string
	}[]
}

export interface TransferTransaction {
	id: string
	type: 'envelope' | 'location'
	userId: string
	title: string
	date: number
	amount: number
	givingAccountsBreakdown: {
		amount: number
		id: string
	}[]
	receivingAccountsBreakdown: {
		amount: number
		id: string
	}[]
}
