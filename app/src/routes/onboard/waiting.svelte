<script lang="ts">
	import { onDestroy } from 'svelte'

	import { controllers, injectHeartbeat } from '../../api'

	import Button from '../../components/Button.svelte'
	import PageView from '../../components/PageView.svelte'
	import Text from '../../components/Text.svelte'
	import { go, params } from '../../router'

	const { email } = $params
	let allowResend = false

	let timeout: any = null
	function startAllowResendTimer() {
		timeout = setTimeout(() => (allowResend = true), 5000)
	}

	async function resend() {
		allowResend = false
		try {
			await controllers.authenticate.sendConfirmationEmail(email)

			startAllowResendTimer()
		} catch (e) {
			alert(e.message)
		}
	}

	onDestroy(() => clearTimeout(timeout))

	startAllowResendTimer()
</script>

<PageView center>
	<div class="content">
		<Text content="Check your email!" style="title" />

		<div class="spacer" />

		<Text content="We sent you link to confirm {email} belongs to you.  The link is valid for 10 minutes." style="sub-body" />

		<div class="spacer" />
		<div class="spacer" />

		<div class="action">
			<div class="action-item">
				<Button fullWidth large onPressed={() => go('onboard.email')}>
					<Text content="Change Email" />
				</Button>
			</div>

			<div class="action-spacer" />

			<div class="action-item">
				<Button fullWidth large onPressed={allowResend ? resend : null}>
					<Text content="Resend" />
				</Button>
			</div>
		</div>
	</div>
</PageView>

<style>
	.content {
		text-align: center;
		padding: 32px;
	}

	.action {
		display: flex;
		flex-direction: row;
	}
	.action-item {
		flex-basis: 1px;
		flex-grow: 1;
	}
	.action-spacer {
		width: 16px;
	}
</style>
