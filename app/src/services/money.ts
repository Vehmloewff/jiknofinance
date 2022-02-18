export function display(dollars: number) {
	const string = dollars.toFixed(2)
	const [beforeDecimal, afterDecimal] = string.split('.')

	return `$${addCommas(beforeDecimal)}.${afterDecimal}`
}

export function addCommas(value: string) {
	if (value.length < 4) return value

	const beforeComma = value.slice(0, -3)
	const afterComma = value.slice(-3)

	return `${addCommas(beforeComma)},${afterComma}`
}
