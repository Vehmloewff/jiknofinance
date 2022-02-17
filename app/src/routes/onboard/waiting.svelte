<script leng="ts">
	import Button from '../../components/Button.svelte'
	import Center from '../../components/Center.svelte'
	import PageView from '../../components/PageView.svelte'
	import Text from '../../components/Text.svelte'
	import { go } from '../../router'
</script>

<PageView center>
	<div class="content">
		<Text content="Check your email!" style="title" />

		<div class="spacer" />

		<Text content="We sent you link to confirm this email belongs to you.  The link is valid for 10 minutes." style="sub-body" />

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
				<Button fullWidth large onPressed={() => console.log('TODO')}>
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
