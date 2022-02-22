import Root from './mod.svelte'
import { connect, generateClientId } from './api'
import { isProd } from './env'

const clientId = localStorage.getItem('client-id') || generateClientId()
localStorage.setItem('client-id', clientId)

const host = isProd ? 'api.finance.jikno.com' : `${location.host.split(':')[0]}:8080`

connect({
	clientId,
	host,
	forceSecure: false,
})

const app = new Root({
	target: document.body,
})

export default app
