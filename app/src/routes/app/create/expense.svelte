<script lang="ts">
	import Button from '../../../components/Button.svelte'
	import { Capacitor } from '@capacitor/core'
	import PageView from '../../../components/PageView.svelte'
	import Text from '../../../components/Text.svelte'
	import { Camera, CameraResultType } from '../../../services/camera'
	import { onMount } from 'svelte'
	import { addCommas } from '../../../services/money'
	import Icon from '../../../components/Icon.svelte'

	export let showOverlay = Capacitor.isNativePlatform()

	let name = ''
	let amount = '0.00'

	let amountField: HTMLInputElement
	let envelopeBreakdown: { amount: number; id: string; name: string }[] = []

	onMount(() => amountField.focus())

	function onAmountInput() {
		const strippedValue = amountField.value.replace(/\./g, '').replace(/,/g, '').replace(/^0+/, '') // remove decimals, commas, and leading zeros

		const addZeros = (value: string, max: number) => {
			if (value.length >= max) return value

			return addZeros(`0${value}`, max)
		}

		const beforeDecimal = addZeros(strippedValue.slice(0, -2), 1)
		const afterDecimal = addZeros(strippedValue.slice(-2), 2)

		amountField.value = `${addCommas(beforeDecimal)}.${afterDecimal}`
	}

	async function takePhoto() {
		if (!Capacitor.isNativePlatform()) {
			console.error('Camera APIs are not available on the web')
			return (showOverlay = false)
		}

		const image = await Camera.getPhoto({
			resultType: CameraResultType.DataUrl,
		})

		console.log(image.dataUrl)

		showOverlay = false
	}

	function save() {
		console.log('todo')
	}

	function allocate() {
		console.log('todo')
	}
</script>

<PageView title="New Expense">
	<div class="container expense">
		<div class="fields" class:blur={showOverlay}>
			<div class="spacer" />

			<div class="first-row">
				<div class="amount look-like-input" on:click={() => amountField.focus()}>
					<div class="dollar-sign">
						<Text content="$" />
					</div>
					<input type="tel" class="bare" on:input={onAmountInput} bind:this={amountField} bind:value={amount} />
				</div>

				<div class="flex-spacer" />

				<div class="allocate">
					<Button fullWidth onPressed={allocate}>
						<div class="allocate-icon-row">
							<div class="allocate-column">
								<Text content="Allocate" nowrap />
								{#each envelopeBreakdown as breakdown}
									<Text content={breakdown.name} style="sub-body" />
								{:else}
									<Text content="no envelopes chosen" style="sub-body" nowrap />
								{/each}
							</div>
							<Icon name="solid::chevron-down" />
						</div>
					</Button>
				</div>
			</div>

			<div class="spacer" />
			<div class="spacer" />

			<Text content="Title" style="subheader" />
			<div class="tiny-space" />
			<input type="text" placeholder="What incurred this expense?" bind:value={name} />

			<div class="flex-space" />

			<div class="actions">
				<Button large onPressed={save} primary fullWidth>
					<Text content="Save" style="large-body" />
				</Button>
			</div>

			<div class="spacer" />
		</div>

		{#if showOverlay}
			<div class="overlay">
				<Button primary onPressed={takePhoto} large>
					<Text content="Take a photo" style="large-body" />
				</Button>
			</div>
		{/if}
	</div>
</PageView>

<style>
	.expense {
		position: relative;
		height: 100%;
	}

	.fields {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.fields.blur {
		filter: blur(var(--glass-blur));
	}

	.first-row {
		display: flex;
		flex-direction: column;
	}

	.amount {
		display: flex;
		cursor: text;
	}
	.amount input {
		width: 100%;
		text-align: right;
	}
	.amount .dollar-sign {
		opacity: 0.5;
	}

	.flex-spacer {
		width: 16px;
		height: 16px;
	}

	.allocate {
		flex-grow: 1;
		flex-shrink: 1;
		min-width: 0;
	}
	.allocate-icon-row {
		display: flex;
		align-items: center;
		padding: 8px 0;
	}
	.allocate-column {
		min-width: 0;
		flex-shrink: 1;
		flex-grow: 1;
		text-align: center;
	}

	@media (min-width: 500px) {
		.first-row {
			flex-direction: row;
		}
		.amount {
			width: 100px;
		}
	}

	.tiny-space {
		height: 8px;
	}

	.flex-space {
		flex-grow: 1;
	}

	.overlay {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
