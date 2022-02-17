import Root from './mod.svelte'
import { connect, generateClientId } from './api'

const clientId = localStorage.getItem('client-id') || generateClientId()
localStorage.setItem('client-id', clientId)

connect({
	clientId,
	host: `${location.host.split(':')[0]}:8080`,
	forceSecure: false,
})

const app = new Root({
	target: document.body,
})

export default app
