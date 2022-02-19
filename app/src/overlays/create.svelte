<script lang="ts">
	import AccountPicker from '../.helpers/AccountPicker.svelte'
	import { controllers } from '../api'

	import Icon from '../components/Icon.svelte'
	import Overlay from '../components/Overlay.svelte'
	import Text from '../components/Text.svelte'
	import { addCommas } from '../services/money'
	import { createOverlay } from './mod'

	let amountString = '000'
	$: dollarsString = addCommas(amountString.slice(0, -2))
	$: centsString = amountString.slice(-2)

	let loading = false
	$: invalid = amount === 0 || loading

	let type: 'income' | 'expense' = 'expense'
	$: amount = parseFloat(`${dollarsString}.${centsString}`)
	let envelopeId: null | string = null
	let locationId: null | string = null

	function addZeros(value: string, max: number) {
		if (value.length >= max) return value

		return addZeros(`0${value}`, max)
	}

	function stripLeadingZeros(value: string) {
		return value.replace(/^0+/, '')
	}

	function append(number: string) {
		console.log(number)
		amountString = addZeros(stripLeadingZeros(amountString) + number, 3)
	}

	function pop() {
		amountString = addZeros(stripLeadingZeros(amountString).slice(0, -1), 3)
	}

	async function save() {
		loading = true

		try {
			await controllers.transaction.createFluctuateTransaction({
				amount,
				date: Date.now(),
				envelopeBreakdown: [],
				locationBreakdown: [],
				title: null,
				type,
			})
		} catch (e) {
			// TODO an elegant snackbar to display this error
			alert(`Failed to create transaction: ${e.message}`)
			console.error(e)
		}

		loading = false
	}

	const keyboardDef = [
		[
			{ text: '1', action: () => append('1') },
			{ text: '2', action: () => append('2') },
			{ text: '3', action: () => append('3') },
		],
		[
			{ text: '4', action: () => append('4') },
			{ text: '5', action: () => append('5') },
			{ text: '6', action: () => append('6') },
		],
		[
			{ text: '7', action: () => append('7') },
			{ text: '8', action: () => append('8') },
			{ text: '9', action: () => append('9') },
		],
		[
			{ text: '0', action: () => append('0') },
			{ icon: 'solid::backspace', action: () => pop() },
			{ text: 'Save', action: () => save(), disabledIfInvalid: true, small: true, primary: true },
		],
	]
</script>

<Overlay
	title="Create Transaction"
	backButtonText="Cancel"
	actionButtonText="Save"
	boldActionButton
	actionButtonDisabled={invalid}
	onBackButtonPressed={() => createOverlay.close(null)}
>
	<div class="create-container">
		<div class="spacer" />

		<div class="switch-bar">
			<div class="item" class:active={type === 'expense'} on:click={() => (type = 'expense')}>
				<Text content="Expense" />
			</div>
			<div class="item" class:active={type === 'income'} on:click={() => (type = 'income')}>
				<Text content="Income" />
			</div>
		</div>

		<div class="flex-gap" />

		<div class="dollars">
			<div class="little">$</div>
			<div class="big">{dollarsString}</div>
			<div class="little">{centsString}</div>
		</div>

		<div class="flex-gap" />

		<div class="allocate">
			<div class="account">
				<AccountPicker isEnvelope={true} onPick={id => (envelopeId = id)} />
			</div>
			<div class="account-spacer" />
			<div class="account">
				<AccountPicker isEnvelope={false} onPick={id => (envelopeId = id)} />
			</div>
		</div>

		<div class="keyboard">
			{#each keyboardDef as keyboardRow}
				<div class="keyboard-row">
					{#each keyboardRow as button}
						<div
							class="button clickable"
							class:primary={button.primary}
							on:click={() => {
								if (!button.disabledIfInvalid || !invalid) button.action()
							}}
							class:disabled={button.disabledIfInvalid && invalid}
						>
							{#if button.icon}
								<Icon name={button.icon} />
							{:else}
								<Text content={button.text} style={button.small ? 'large-body' : 'large'} />
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</Overlay>

<style>
	.create-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.switch-bar {
		margin: 0 16px;
		display: flex;
		border-radius: 8px;
		border: 1px solid var(--action);
	}
	.switch-bar .item {
		line-height: 34px;
		text-align: center;
		flex-grow: 1;
	}
	.switch-bar .item.active {
		background: var(--action);
	}

	.flex-gap {
		flex-grow: 1;
	}

	.dollars {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		font-family: 'Rubik', sans-serif;
	}
	.dollars .little {
		padding-top: 10px;
		font-size: 35px;
	}
	.dollars .big {
		font-size: 70px;
		padding: 0 5px;
	}

	.allocate {
		display: flex;
		padding: 0 16px;
	}
	.allocate .account-spacer {
		width: 16px;
	}
	.allocate .account {
		flex-grow: 1;
		flex-basis: 40px;
		flex-shrink: 1;
		min-width: 0;
	}

	.keyboard {
		display: flex;
		flex-direction: column;
		height: 390px;
		justify-content: space-evenly;
	}
	.keyboard-row {
		display: flex;
		justify-content: space-evenly;
	}
	.keyboard .button {
		width: 80px;
		height: 80px;
		border-radius: 40px;
		background: var(--background1);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--background4);
	}
	.keyboard .button.primary {
		background: var(--action);
		color: var(--on-action);
	}

	.disabled {
		filter: grayscale(1);
		opacity: 0.5;
	}
</style>
