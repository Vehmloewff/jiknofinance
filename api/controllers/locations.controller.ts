import { Context, pluralConnection, Connection, UserError, PluralConnection } from '../deps.ts'
import { getRealUser, sureGet, makeLocationId } from '../utils.ts'
import { Location, UserInfo } from '../db.cluster.ts'

export function $locations(connection: Connection): PluralConnection<Location> {
	return pluralConnection({
		connection,
		model: Location,
		async onChange() {
			const user = await connection.getUser()
			if (!user.isReal) return []

			const { locationIds } = await sureGet(UserInfo, user.userId)

			return await Promise.all(
				locationIds.map(async locationId => {
					return await sureGet(Location, locationId)
				})
			)
		},
	})
}

export async function createNewLocation(context: Context, name: string): Promise<string> {
	const user = await getRealUser(context)

	const id = makeLocationId()
	const info = await sureGet(UserInfo, user.userId)
	info.locationIds.push(id)
	UserInfo.update(info)

	// call this last so that when $locations updates, the new locationIds userInfo property is set
	await Location.insert({
		id,
		balance: 0,
		color: null,
		icon: null,
		isDefaultExpenseLocation: info.locationIds.length === 0,
		name,
	})

	return id
}

export async function editLocationStyles(
	context: Context,
	params: { name: string; icon: string | null; color: string | null; id: string }
) {
	const user = await getRealUser(context)

	const location = await Location.get(params.id)
	if (!location) throw new UserError(`Location ${params.id} does not exist`)

	await ensureUserOwnsLocation(user.userId, location.id)

	location.name = params.name
	location.icon = params.icon
	location.color = params.color

	await Location.update(location)
}

export async function removeLocation(context: Context, id: string) {
	const user = await getRealUser(context)

	await ensureUserOwnsLocation(user.userId, id)

	await Location.remove(id)
}

export async function getDefaultExpenseLocation(context: Context): Promise<string | null> {
	const user = await getRealUser(context)

	const { locationIds } = await sureGet(UserInfo, user.userId)

	const locations = await Promise.all(
		locationIds.map(async locationId => {
			return await sureGet(Location, locationId)
		})
	)

	for (const location of locations) {
		if (location.isDefaultExpenseLocation) return location.id
	}

	return null
}

async function ensureUserOwnsLocation(userId: string, locationId: string) {
	const userInfo = await sureGet(UserInfo, userId)

	if (userInfo.locationIds.indexOf(locationId) !== -1) throw new UserError(`User ${userId} does not own location ${locationId}`)
}
