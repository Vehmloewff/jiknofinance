<script lang="ts">
	import { controllers } from '../../api'
	import Text from '../../components/Text.svelte'
	import { accountDisplayTitle } from '../../routes/app/.helpers/utils'
	import { display } from '../../services/money'

	export let breakdown: { id: string; amount: number }
	export let totalAmount: number
	export let displayPercentage = false
	export let isAddition = false
</script>

<div class="breakdown-line">
	<div class="title">
		{#await controllers.user.getAccountName(breakdown.id)}
			<Text content="..." />
		{:then name}
			<Text content={accountDisplayTitle(name)} />
		{:catch error}
			<Text content={error.message} style="sub-body" />
		{/await}
	</div>

	<div class="space" />

	{#if displayPercentage}
		<div class="percentage">
			<Text content="{Math.round((breakdown.amount / totalAmount) * 100)}%" style="sub-body" />
		</div>

		<div class="space" />
	{/if}
	<div class="amount" style="color: {isAddition ? 'var(--clear)' : 'var(--danger)'}">
		<Text content="{isAddition ? '' : '-'}{display(breakdown.amount)}" />
	</div>
</div>

<style>
	.breakdown-line {
		display: flex;
		height: 14px;
		align-items: center;
		padding: 8px 0;
	}

	.title {
		flex-grow: 1;
	}

	.space {
		width: 16px;
	}
</style>
