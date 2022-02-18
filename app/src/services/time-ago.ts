const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

function getClockHours(hours: number) {
	if (hours === 0) return 12
	if (hours > 12) hours - 12

	return hours
}

function getClockMode(hours: number) {
	if (hours >= 12) return 'pm'

	return 'am'
}

function getFormattedDate(date: Date, preformattedDate: string | null = null, hideYear = false) {
	const day = date.getDate()
	const month = MONTH_NAMES[date.getMonth()]
	const year = date.getFullYear()
	const hours = date.getHours()
	let minutes = date.getMinutes()

	if (minutes < 10) {
		// Adding leading zero to minutes
		minutes = parseInt(`0${minutes}`)
	}

	if (preformattedDate) {
		// Today at 10:20 am
		// Yesterday at 10:20 am
		return `${preformattedDate} at ${getClockHours(hours)}:${minutes} ${getClockMode(hours)}`
	}

	if (hideYear) {
		// January 10 at 10:20 am
		return `${month} ${day} at ${getClockHours(hours)}:${minutes} ${getClockMode(hours)}`
	}

	// January 10, 2017 at 10:20 am
	return `${month} ${day}, ${year} at ${getClockHours(hours)}:${minutes} ${getClockMode(hours)}`
}

// --- Main function
export function calculateTimeAgo(dateParam: Date | number) {
	const date = dateParam instanceof Date ? dateParam : new Date(dateParam)
	const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
	const today = new Date()
	const yesterday = new Date(today.getTime() - DAY_IN_MS)
	const seconds = Math.round((today.getTime() - date.getTime()) / 1000)
	const minutes = Math.round(seconds / 60)
	const isToday = today.toDateString() === date.toDateString()
	const isYesterday = yesterday.toDateString() === date.toDateString()
	const isThisYear = today.getFullYear() === date.getFullYear()

	if (seconds < 5) {
		return 'now'
	} else if (seconds < 60) {
		return `${seconds} seconds ago`
	} else if (seconds < 90) {
		return 'about a minute ago'
	} else if (minutes < 60) {
		return `${minutes} minutes ago`
	} else if (isToday) {
		return getFormattedDate(date, 'Today') // Today at 10:20
	} else if (isYesterday) {
		return getFormattedDate(date, 'Yesterday') // Yesterday at 10:20
	} else if (isThisYear) {
		return getFormattedDate(date, null, true) // 10. January at 10:20
	}

	return getFormattedDate(date) // 10. January 2017. at 10:20
}
