import { Context, UserError, sendEmail, assignClientToUser, unAssociateClient } from '../deps.ts'
import { UserInfo, Envelope } from '../db.cluster.ts'
import { makeAppLink, makeEnvelopeId, makeUserId } from '../utils.ts'
import { seed } from '../seed.ts'

// Seed the demo user for testing
await seed()

const makeConfirmationEmail = (magicLink: string) => `
${magicLink}

Hey there!  You need to confirm your email to continue with Jikno Finance.  Click the link above to complete the process.

The link is valid for 10 minutes.

Cheers,

Jikno Finance Team
`

// the one time password linked to the email of the user to create the account for
const confirmationOtps = new Map<string, string>()

export async function sendConfirmationEmail(context: Context, email: string) {
	const user = await context.getUser()
	if (!user.isGuest) throw new UserError('You cannot be logged in to perform this action')

	// if the email is demo (auto login into a demo user)
	if (email === 'demo') {
		assignClientToUser(user.clientId, 'demo')

		return
	}

	const otp = makeOtp()
	const magicLink = makeAppLink(user.clientId, 'onboard.receive-otp', { otp }, context.request.headers.get('origin'))

	confirmationOtps.set(otp, email)

	// If the password is never manually verified, delete it after 10 minutes
	setTimeout(() => confirmationOtps.delete(otp), 60 * 1000 * 10)

	await sendEmail({
		content: makeConfirmationEmail(magicLink),
		to: email,
		subject: 'Jikno Finance Email Confirmation Link',
	})

	console.log('sent confirmation email.  Here is the link for easy access:', magicLink)
}

export async function verifyOtp(context: Context, otp: string) {
	const user = await context.getUser()
	if (!user.isGuest) throw new UserError('You are already signed up and logged in')

	const email = confirmationOtps.get(otp)
	if (!email) throw new UserError('Link has expired')

	const existingUserId = await inferUserIdFromEmail(email)
	confirmationOtps.delete(otp)

	const userId = existingUserId || makeUserId()

	if (!existingUserId) {
		const titheEnvelope: Envelope = {
			id: makeEnvelopeId(),
			balance: 0,
			name: '_builtin.tithe',
			icon: null,
			color: null,
		}

		const info: UserInfo = {
			id: userId,
			email,
			envelopeIds: [titheEnvelope.id],
			incomeTypeIds: [],
			locationIds: [],
			pinnedEnvelopeIds: [],
			unallocatedExpenseTransactions: [],
		}

		await Envelope.insert(titheEnvelope)
		await UserInfo.insert(info)
	}

	assignClientToUser(user.clientId, userId)
}

export async function logout(context: Context) {
	const user = await context.getUser()
	if (!user.isReal) throw new UserError('You are not logged in to begin with')

	unAssociateClient(user.clientId)
}

async function inferUserIdFromEmail(email: string) {
	for await (const info of UserInfo.all()) {
		if (info.email === email) return info.id
	}

	return null
}

function makeOtp() {
	return `JiknoFinanceOTP-${crypto.randomUUID()}`
}
